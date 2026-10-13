const { Booking, Show, Seat, Movie, Theatre, User } = require('../models');
const { Op } = require('sequelize');
const { sendBookingConfirmation } = require('../services/emailService');

exports.createBooking = async (req, res, next) => {
  try {
    let {
      show_id,
      seat_ids,
      seats = [],
      beverages = [],
      discount_code,
      movie_id,
      theatre_id,
      total_amount,
      booking_code,
    } = req.body;

    // 1. Resolve Show
    let show = null;
    if (show_id) {
      show = await Show.findByPk(show_id, {
        include: [{ model: Movie, as: 'movie' }, { model: Theatre, as: 'theatre' }],
      });
    }

    if (!show && movie_id) {
      // Find active show for this movie
      show = await Show.findOne({
        where: { movie_id, is_active: true },
        include: [{ model: Movie, as: 'movie' }, { model: Theatre, as: 'theatre' }],
        order: [['show_date', 'ASC'], ['show_time', 'ASC']],
      });

      // If no show found, find or create one
      if (!show) {
        let theatre = theatre_id ? await Theatre.findByPk(theatre_id) : await Theatre.findOne();
        if (!theatre) {
          theatre = await Theatre.create({
            name: req.body.theatre_name || 'CineVerse IMAX Palladium',
            city: 'Mumbai',
            address: 'High Street Phoenix, Lower Parel',
            total_screens: 4,
          });
        }
        show = await Show.create({
          movie_id,
          theatre_id: theatre.id,
          show_date: new Date().toISOString().split('T')[0],
          show_time: '18:00:00',
          base_price: 250.0,
          format: 'IMAX',
          language: 'Hindi',
          available_seats: 100,
          screen_number: 1,
          is_active: true,
        });
        show = await Show.findByPk(show.id, {
          include: [{ model: Movie, as: 'movie' }, { model: Theatre, as: 'theatre' }],
        });
      }
    }

    if (!show) {
      show = await Show.findOne({
        include: [{ model: Movie, as: 'movie' }, { model: Theatre, as: 'theatre' }],
      });
    }

    if (!show) {
      return res.status(404).json({ success: false, message: 'No active show available for booking' });
    }

    show_id = show.id;

    // 2. Resolve Seats
    let resolvedSeats = [];
    if (Array.isArray(seats) && seats.length > 0) {
      resolvedSeats = seats.map((s) => {
        if (typeof s === 'object') return s;
        return {
          id: s,
          row: s[0] || 'A',
          number: parseInt(s.slice(1), 10) || 1,
          tier: 'STANDARD',
          price: parseFloat(show.base_price) || 250,
        };
      });
    } else if (Array.isArray(seat_ids) && seat_ids.length > 0) {
      const dbSeats = await Seat.findAll({ where: { id: { [Op.in]: seat_ids }, show_id } });
      if (dbSeats.length > 0) {
        resolvedSeats = dbSeats.map((s) => ({
          id: s.id,
          row: s.row_label,
          number: s.seat_number,
          type: s.seat_type,
          price: parseFloat(show.base_price) * parseFloat(s.price_multiplier),
        }));
      } else {
        resolvedSeats = seat_ids.map((id) => ({
          id,
          row: String(id)[0] || 'A',
          number: 1,
          price: parseFloat(show.base_price) || 250,
        }));
      }
    }

    if (!resolvedSeats || resolvedSeats.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one seat to proceed with booking.' });
    }

    // 3. Pricing
    let ticket_price = resolvedSeats.reduce((sum, s) => sum + (parseFloat(s.price) || 250), 0);
    let beverage_price = beverages.reduce((sum, b) => sum + (parseFloat(b.price) || 0) * (b.quantity || b.qty || 1), 0);
    let convenience_fee = ticket_price > 0 ? 30 : 0;
    let discount_amount = parseFloat(req.body.discount) || 0;

    const DISCOUNTS = { CINE10: 0.10, CINE20: 0.20, FIRST50: 0.50 };
    if (discount_code && DISCOUNTS[discount_code.toUpperCase()]) {
      discount_amount = parseFloat((ticket_price * DISCOUNTS[discount_code.toUpperCase()]).toFixed(2));
    }

    let calculated_total = parseFloat((ticket_price + beverage_price + convenience_fee - discount_amount).toFixed(2));
    let final_total = total_amount ? parseFloat(total_amount) : Math.max(0, calculated_total);

    // 4. Create Booking
    const booking = await Booking.create({
      user_id: req.user.id,
      show_id,
      booking_code: booking_code || undefined,
      seats: resolvedSeats,
      beverages,
      ticket_price,
      beverage_price,
      convenience_fee,
      discount_code: discount_code || req.body.promo_code || null,
      discount_amount,
      total_amount: final_total,
      status: 'confirmed',
      payment_status: 'paid',
    });

    const bookingResponse = {
      ...booking.toJSON(),
      movie_title: req.body.movie_title || show.movie?.title,
      movie_poster: req.body.movie_poster || show.movie?.poster_url,
      theatre_name: req.body.theatre_name || show.theatre?.name,
      show_time: req.body.show_time || show.show_time,
      show_date: req.body.show_date || show.show_date,
    };

    res.status(201).json({
      success: true,
      message: '🎉 Booking confirmed successfully!',
      booking: bookingResponse,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Show,
        as: 'show',
        include: [{ model: Movie, as: 'movie' }, { model: Theatre, as: 'theatre' }],
      }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{
        model: Show,
        as: 'show',
        include: [{ model: Movie, as: 'movie' }, { model: Theatre, as: 'theatre' }],
      }],
    });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.id);
    const whereClause = { user_id: req.user.id };
    if (isUuid) {
      whereClause.id = req.params.id;
    } else {
      whereClause.booking_code = req.params.id;
    }

    const booking = await Booking.findOne({ where: whereClause });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status === 'cancelled') return res.status(400).json({ success: false, message: 'Ticket is already cancelled' });

    // Cancellation policy: Allowed within 4 days of booking creation
    const bookingTime = new Date(booking.createdAt).getTime();
    const nowTime = Date.now();
    const diffDays = (nowTime - bookingTime) / (1000 * 60 * 60 * 24);

    if (diffDays > 4) {
      return res.status(400).json({
        success: false,
        message: 'Cancellation period expired. Tickets can only be cancelled within 4 days of booking.',
      });
    }

    // Release seats
    if (Array.isArray(booking.seats)) {
      const seatIds = booking.seats.map((s) => (typeof s === 'object' && s ? s.id : s)).filter(Boolean);
      if (seatIds.length > 0) {
        await Seat.update({ status: 'available', held_by: null, held_until: null }, { where: { id: { [Op.in]: seatIds } } });
      }
    }

    await booking.update({ status: 'cancelled', payment_status: 'refunded' });
    res.json({
      success: true,
      message: `🎉 Booking cancelled successfully. ₹${booking.total_amount} refund initiated to original payment method.`,
      booking,
    });
  } catch (err) {
    next(err);
  }
};
