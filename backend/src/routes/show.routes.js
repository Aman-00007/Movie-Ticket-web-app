const express = require('express');
const router = express.Router();
const { getShowSeats, getNearbyShows } = require('../controllers/showController');

router.get('/nearby', getNearbyShows);
router.get('/:showId/seats', getShowSeats);

module.exports = router;
