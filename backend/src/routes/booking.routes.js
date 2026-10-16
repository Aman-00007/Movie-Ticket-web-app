const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookingById, cancelBooking } = require('../controllers/bookingController');
const { protect, optionalAuth } = require('../middleware/auth.middleware');

router.post('/', optionalAuth, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.delete('/:id', protect, cancelBooking);
router.post('/:id/cancel', protect, cancelBooking);

module.exports = router;

