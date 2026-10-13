const { Booking, Show, Seat, Movie, Theatre, User } = require('../models');
const { Op } = require('sequelize');
const { sendBookingConfirmation } = require('../services/emailService');

exports.createBooking = async (req, res, next) => {
  try {
    const { show_id, seat_ids, beverages = [], discount_code } = req.body;
    if (!show_id || !seat_ids?.length) {
      return res.status(400).json({ success: false, message: 'show_id and seat_ids are required' });
    }

    const show = await Show.findByPk(show_id, {
      include: [{ model: Movie, as: 'movie' }, { model: Theatre, as: 'theatre' }],
    });
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });

    // Check seats availability
    const seats = await Seat.findAll({ where: { id: { [Op.in]: seat_ids }, show_id } });
    const unavailable = seats.filter((s) => s.status !== 'available');
    if (unavailable.length > 0) {
      return res.status(409).json({ success: false, message: `Seats ${unavailable.map((s) => `${s.row_label}${s.seat_number}`).join(', ')} are not available` });
    }

    // Calculate pricing
    let ticket_price = seats.reduce((sum, s) => sum + parseFloat(show.base_price) * parseFloat(s.price_multiplier), 0);
    let beverage_price = beverages.reduce((sum, b) => sum + b.price * b.quantity, 0);
    let convenience_fee = parseFloat((ticket_price * 0.05).toFixed(2));
    let discount_amount = 0;

    // Simple discount codes
    const DISCOUNTS = { CINE10: 0.10, CINE20: 0.20, FIRST50: 0.50 };
    if (discount_code && DISCOUNTS[discount_code.toUpperCase()]) {
      discount_amount = parseFloat((ticket_price * DISCOUNTS[discount_code.toUpperCase()]).toFixed(2));
    }

    const total_amount = parseFloat((ticket_price + beverage_price + convenience_fee - discount_amount).toFixed(2));

    // Hold seats for 10 minutes
    const heldUntil = new Date(Date.now() + 10 * 60 * 1000);
    await Seat.update(
      { status: 'held', held_by: req.user.id, held_until: heldUntil },
      { where: { id: { [Op.in]: seat_ids } } }
    );

    const booking = await Booking.create({
      user_id: req.user.id,
      show_id,
      seats: seats.map((s) => ({ id: s.id, row: s.row_label, number: s.seat_number, type: s.seat_type, price: parseFloat(show.base_price) * parseFloat(s.price_multiplier) })),
      beverages,
      ticket_price,
      beverage_price,
      convenience_fee,
      discount_code,
      discount_amount,
      total_amount,
      status: 'pending',
      payment_status: 'pending',
    });

    res.status(201).json({ success: true, message: 'Seats held for 10 minutes. Complete payment to confirm.', booking, hold_until: heldUntil });
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
    const booking = await Booking.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status === 'cancelled') return res.status(400).json({ success: false, message: 'Already cancelled' });

    // Release seats
    const seatIds = booking.seats.map((s) => s.id);
    await Seat.update({ status: 'available', held_by: null, held_until: null }, { where: { id: { [Op.in]: seatIds } } });

    await booking.update({ status: 'cancelled', payment_status: 'refunded' });
    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (err) {
    next(err);
  }
};
