const { Movie, Show, Seat, Theatre, Booking } = require('../models');
const { Op } = require('sequelize');
const { REAL_2026_MOVIES, fetchMovieWithGeminiFlash } = require('../services/movieData2026');

// Helper to auto-create active shows & interactive seat maps for a movie
async function createShowsForMovie(movie) {
  try {
    const theatres = await Theatre.findAll({ limit: 4 });
    if (!theatres || theatres.length === 0) return;

    const showTimes = [
      { start: '10:30:00', format: 'IMAX' },
      { start: '14:15:00', format: '3D' },
      { start: '18:00:00', format: 'IMAX' },
      { start: '21:30:00', format: '4DX' },
    ];

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const dates = [today, tomorrow];

    for (const date of dates) {
      for (const theatre of theatres) {
        for (const st of showTimes) {
          const show = await Show.create({
            movie_id: movie.id,
            theatre_id: theatre.id,
            show_date: date,
            show_time: st.start,
            base_price: 250.0,
            format: st.format,
            language: (movie.language && movie.language[0]) || 'Hindi',
            available_seats: 50,
            screen_number: 1,
            is_active: true,
          });

          const rows = [
            { row: 'A', type: 'normal', mult: 1.0 },
            { row: 'B', type: 'normal', mult: 1.0 },
            { row: 'C', type: 'premium', mult: 1.4 },
            { row: 'D', type: 'vip', mult: 1.6 },
            { row: 'E', type: 'recliner', mult: 1.8 },
          ];

          const seatData = [];
          for (const r of rows) {
            for (let num = 1; num <= 10; num++) {
              seatData.push({
                show_id: show.id,
                row_label: r.row,
                seat_number: num,
                seat_type: r.type,
                price_multiplier: r.mult,
                status: 'available',
              });
            }
          }
          await Seat.bulkCreate(seatData);
        }
      }
    }
  } catch (err) {
    console.warn('Could not auto-create shows for movie:', err.message);
  }
}

// 1. Get all movies with optional filters
exports.getMovies = async (req, res, next) => {
  try {
    const { status, genre, language, page = 1, limit = 50, q } = req.query;
    const where = {};

    if (status) where.status = status;
    if (q) where.title = { [Op.iLike]: `%${q}%` };
    if (genre && genre !== 'All') where.genre = { [Op.contains]: [genre] };
    if (language && language !== 'All') where.language = { [Op.contains]: [language] };

    const { count, rows } = await Movie.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['rating', 'DESC'], ['release_date', 'DESC']],
    });

    res.json({
      success: true,
      data: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    next(err);
  }
};

// 2. Now Showing movies
exports.getNowShowing = async (req, res, next) => {
  try {
    const movies = await Movie.findAll({
      where: { status: 'now_showing' },
      order: [['rating', 'DESC'], ['votes', 'DESC']],
    });
    res.json({ success: true, data: movies });
  } catch (err) {
    next(err);
  }
};

// 3. Upcoming movies
exports.getUpcoming = async (req, res, next) => {
  try {
    const movies = await Movie.findAll({
      where: { status: 'upcoming' },
      order: [['release_date', 'ASC'], ['rating', 'DESC']],
    });
    res.json({ success: true, data: movies });
  } catch (err) {
    next(err);
  }
};

// 4. Movie by ID with shows
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: [{
        model: Show,
        as: 'shows',
        where: { show_date: { [Op.gte]: new Date().toISOString().split('T')[0] }, is_active: true },
        required: false,
        include: [{ model: Theatre, as: 'theatre' }],
        order: [['show_date', 'ASC'], ['show_time', 'ASC']],
      }],
    });

    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, data: movie });
  } catch (err) {
    next(err);
  }
};

// 5. Search Movies
exports.searchMovies = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });

    const movies = await Movie.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { director: { [Op.iLike]: `%${q}%` } },
        ]
      },
      limit: 15,
      order: [['rating', 'DESC']],
    });
    res.json({ success: true, data: movies });
  } catch (err) {
    next(err);
  }
};

// 6. Create Movie (Manual)
exports.createMovie = async (req, res, next) => {
  try {
    const {
      title,
      description,
      poster_url,
      backdrop_url,
      banner_url,
      trailer_url,
      duration_min = 135,
      rating = 8.5,
      genre = ['Action'],
      language = ['Hindi'],
      release_date = '2026-08-15',
      certification = 'UA',
      status = 'upcoming',
      cast = [],
      director = 'Director',
      votes = 1500,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Movie title is required' });
    }

    const movie = await Movie.create({
      title,
      description: description || `Experience the monumental cinematic spectacle of ${title}.`,
      poster_url: poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
      backdrop_url: backdrop_url || banner_url || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&auto=format&fit=crop&q=80',
      banner_url: banner_url || backdrop_url || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&auto=format&fit=crop&q=80',
      trailer_url: trailer_url || 'https://www.youtube.com/embed/g3JUbgZXflM',
      duration_min: parseInt(duration_min),
      rating: parseFloat(rating),
      genre: Array.isArray(genre) ? genre : [genre],
      language: Array.isArray(language) ? language : [language],
      release_date,
      certification,
      status,
      cast,
      director,
      votes: parseInt(votes) || 1200,
    });

    if (status === 'now_showing') {
      await createShowsForMovie(movie);
    }

    res.status(201).json({ success: true, message: 'Movie created successfully', data: movie });
  } catch (err) {
    next(err);
  }
};

// Helper to normalize any YouTube link to iframe embed format
const normalizeTrailerUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  const trimmed = url.trim();
  if (trimmed.includes('youtube.com/embed/')) return trimmed;
  
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  const watchMatch = trimmed.match(/youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  return trimmed;
};

// 7. Update Movie (Enables Admin to fix wrong trailer links, posters, titles, backdrops, etc.)
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });

    const updateData = { ...req.body };
    if (updateData.trailer_url) {
      updateData.trailer_url = normalizeTrailerUrl(updateData.trailer_url);
    }
    if (updateData.backdrop_url && !updateData.banner_url) {
      updateData.banner_url = updateData.backdrop_url;
    }

    const previousStatus = movie.status;
    await movie.update(updateData);

    // If status changed to now_showing, create shows if none exist
    if (movie.status === 'now_showing' && previousStatus !== 'now_showing') {
      const showCount = await Show.count({ where: { movie_id: movie.id } });
      if (showCount === 0) {
        await createShowsForMovie(movie);
      }
    }

    res.json({ success: true, message: `Movie "${movie.title}" updated successfully in database!`, data: movie });
  } catch (err) {
    next(err);
  }
};

// 8. Delete Movie (Removes old movie and associated records)
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });

    const title = movie.title;
    // Delete shows (which cascades seats)
    await Show.destroy({ where: { movie_id: movie.id } });
    await movie.destroy();

    res.json({ success: true, message: `Movie "${title}" was successfully deleted from the database.` });
  } catch (err) {
    next(err);
  }
};

// 9. AI Web Search & Add Movie using Gemini Flash
exports.aiSearchAndAdd = async (req, res, next) => {
  try {
    const { query, autoSave = true } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    console.log(`🤖 [Gemini Flash] Searching web and researching movie for: "${query}"...`);
    const { movieData, modelUsed } = await fetchMovieWithGeminiFlash(query);

    let savedMovie = null;
    if (autoSave) {
      // Check if movie already exists
      const existing = await Movie.findOne({
        where: { title: { [Op.iLike]: movieData.title } },
      });

      if (existing) {
        await existing.update(movieData);
        savedMovie = existing;
      } else {
        savedMovie = await Movie.create({
          ...movieData,
          banner_url: movieData.backdrop_url,
        });

        if (savedMovie.status === 'now_showing') {
          await createShowsForMovie(savedMovie);
        }
      }
    }

    res.json({
      success: true,
      message: `Gemini Flash researched "${movieData.title}" successfully`,
      modelUsed,
      data: savedMovie || movieData,
      isSaved: Boolean(savedMovie),
    });
  } catch (err) {
    console.error('AI Search & Add error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 10. Sync / Seed Clean 2026 Real-Time Movies (Deletes old 2024/2025 movies and seeds all 2026 blockbusters)
exports.sync2026Movies = async (req, res, next) => {
  try {
    console.log('🔄 Cleaning old movies and syncing authentic 2026 database catalog...');

    // Delete existing shows to avoid orphan foreign keys
    await Show.destroy({ where: {} });
    // Delete all movies
    await Movie.destroy({ where: {} });

    // Seed all 2026 real-world movies
    const createdMovies = [];
    for (const m of REAL_2026_MOVIES) {
      const movie = await Movie.create({
        ...m,
        banner_url: m.backdrop_url,
      });
      createdMovies.push(movie);

      if (movie.status === 'now_showing') {
        await createShowsForMovie(movie);
      }
    }

    res.json({
      success: true,
      message: `Database synchronized with ${createdMovies.length} authentic 2026 movies and showtimes!`,
      total: createdMovies.length,
      data: createdMovies,
    });
  } catch (err) {
    console.error('Sync 2026 movies error:', err.message);
    next(err);
  }
};
