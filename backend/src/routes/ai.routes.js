const express = require('express');
const router = express.Router();
const { getRecommendation, chat } = require('../controllers/aiController');
const { protect } = require('../middleware/auth.middleware');

router.post('/recommend', protect, getRecommendation);
router.post('/chat', protect, chat);

module.exports = router;
