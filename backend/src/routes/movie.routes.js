const express = require('express');
const router = express.Router();
const { getMovies, getNowShowing, getUpcoming, getMovieById, searchMovies } = require('../controllers/movieController');

router.get('/', getMovies);
router.get('/nowshowing', getNowShowing);
router.get('/upcoming', getUpcoming);
router.get('/search', searchMovies);
router.get('/:id', getMovieById);

module.exports = router;
