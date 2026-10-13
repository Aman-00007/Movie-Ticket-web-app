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

router.get('/', getMovies);
router.get('/nowshowing', getNowShowing);
router.get('/upcoming', getUpcoming);
router.get('/search', searchMovies);

// Special Action routes (placed before /:id)
router.post('/ai-search', aiSearchAndAdd);
router.post('/sync-2026', sync2026Movies);

// CRUD
router.post('/', createMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);
router.get('/:id', getMovieById);

module.exports = router;
