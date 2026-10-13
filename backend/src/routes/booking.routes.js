const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookingById, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All booking routes require auth
router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);
router.delete('/:id', cancelBooking);
router.post('/:id/cancel', cancelBooking);

module.exports = router;
