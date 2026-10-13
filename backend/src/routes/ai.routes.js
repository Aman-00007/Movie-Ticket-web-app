const express = require('express');
const router = express.Router();
const { getRecommendation, chat } = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/auth.middleware');

router.post('/recommend', optionalAuth, getRecommendation);
router.post('/chat', optionalAuth, chat);

module.exports = router;

