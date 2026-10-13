const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment, handleWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth.middleware');

// Webhook must use raw body - mounted in app.js before json parser
router.post('/webhook', handleWebhook);

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);

module.exports = router;
