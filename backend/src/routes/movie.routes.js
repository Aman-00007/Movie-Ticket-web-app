const express = require('express');
const router = express.Router();
const {
  getMovies,
  getNowShowing,
  getUpcoming,
  getMovieById,
  searchMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  aiSearchAndAdd,
  sync2026Movies,
} = require('../controllers/movieController');

const { protect, restrictTo } = require('../middleware/auth.middleware');

// Public read routes
router.get('/', getMovies);
router.get('/nowshowing', getNowShowing);
router.get('/upcoming', getUpcoming);
router.get('/search', searchMovies);
router.get('/:id', getMovieById);

// Admin-Only Protected Routes (Requires valid JWT with role = 'admin')
router.post('/ai-search', protect, restrictTo('admin'), aiSearchAndAdd);
router.post('/sync-2026', protect, restrictTo('admin'), sync2026Movies);
router.post('/', protect, restrictTo('admin'), createMovie);
router.put('/:id', protect, restrictTo('admin'), updateMovie);
router.delete('/:id', protect, restrictTo('admin'), deleteMovie);

module.exports = router;
