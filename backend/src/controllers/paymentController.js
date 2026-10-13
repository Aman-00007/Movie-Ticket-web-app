const Stripe = require('stripe');
const { Booking, Seat, Show, Movie, Theatre, User } = require('../models');
const { Op } = require('sequelize');
const { sendBookingConfirmation } = require('../services/emailService');

const stripe = process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')
  ? Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { booking_id } = req.body;
    const booking = await Booking.findOne({ where: { id: booking_id, user_id: req.user.id } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.payment_status === 'paid') return res.status(400).json({ success: false, message: 'Already paid' });

    // Mock payment support if Stripe key is not configured or mock
    if (!stripe) {
      const mockSecret = `mock_secret_${booking.id}_${Date.now()}`;
      await booking.update({ stripe_payment_intent_id: mockSecret });
      return res.json({
        success: true,
        client_secret: mockSecret,
        publishable_key: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_mock',
        is_mock: true,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(booking.total_amount) * 100), // in paise/cents
      currency: 'inr',
      metadata: { booking_id: booking.id, user_id: req.user.id, booking_code: booking.booking_code },
      description: `CineVerse Ticket - ${booking.booking_code}`,
    });

    await booking.update({ stripe_payment_intent_id: paymentIntent.id });

    res.json({
      success: true,
      client_secret: paymentIntent.client_secret,
      publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (err) {
    next(err);
  }
};

exports.confirmPayment = async (req, res, next) => {
  try {
    const { booking_id, payment_intent_id } = req.body;
    const booking = await Booking.findOne({ where: { id: booking_id, user_id: req.user.id } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Handle mock payment
    if (!stripe || payment_intent_id?.startsWith('mock_')) {
      const seatIds = (booking.seats || []).map((s) => s.id);
      await Seat.update({ status: 'booked', held_by: null, held_until: null }, { where: { id: { [Op.in]: seatIds } } });
      await booking.update({
        status: 'confirmed',
        payment_status: 'paid',
        stripe_payment_intent_id: payment_intent_id || `mock_${Date.now()}`,
      });

      sendBookingConfirmation(req.user, booking).catch(console.error);
      return res.json({ success: true, message: '🎉 Booking confirmed successfully!', booking });
    }

    // Verify with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    // Confirm seats
    const seatIds = (booking.seats || []).map((s) => s.id);
    await Seat.update({ status: 'booked', held_by: null, held_until: null }, { where: { id: { [Op.in]: seatIds } } });

    await booking.update({ status: 'confirmed', payment_status: 'paid', stripe_payment_intent_id: payment_intent_id });

    // Send email confirmation (non-blocking)
    sendBookingConfirmation(req.user, booking).catch(console.error);

    res.json({ success: true, message: '🎉 Booking confirmed!', booking });
  } catch (err) {
    next(err);
  }
};

// Stripe webhook - receives raw body
exports.handleWebhook = async (req, res, next) => {
  if (!stripe) return res.json({ received: true });
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object;
      const booking = await Booking.findOne({ where: { stripe_payment_intent_id: pi.id } });
      if (booking && booking.payment_status !== 'paid') {
        const seatIds = (booking.seats || []).map((s) => s.id);
        await Seat.update({ status: 'booked', held_by: null, held_until: null }, { where: { id: { [Op.in]: seatIds } } });
        await booking.update({ status: 'confirmed', payment_status: 'paid' });
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const pi = event.data.object;
      const booking = await Booking.findOne({ where: { stripe_payment_intent_id: pi.id } });
      if (booking) await booking.update({ payment_status: 'failed' });
      break;
    }
  }

  res.json({ received: true });
};
