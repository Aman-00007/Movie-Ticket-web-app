const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment, handleWebhook } = require('../controllers/paymentController');
const { optionalAuth } = require('../middleware/auth.middleware');

// Webhook must use raw body - mounted in app.js before json parser
router.post('/webhook', handleWebhook);

router.post('/create-intent', optionalAuth, createPaymentIntent);
router.post('/confirm', optionalAuth, confirmPayment);

module.exports = router;

