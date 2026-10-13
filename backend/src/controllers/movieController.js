const { Movie, Show, Theatre } = require('../models');
const { Op } = require('sequelize');

exports.getMovies = async (req, res, next) => {
  try {
    const { status, genre, language, page = 1, limit = 20, q } = req.query;
    const where = {};

    if (status) where.status = status;
    if (q) where.title = { [Op.iLike]: `%${q}%` };
    if (genre) where.genre = { [Op.contains]: [genre] };
    if (language) where.language = { [Op.contains]: [language] };

    const { count, rows } = await Movie.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['release_date', 'DESC']],
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

exports.getNowShowing = async (req, res, next) => {
  try {
    const movies = await Movie.findAll({
      where: { status: 'now_showing' },
      order: [['rating', 'DESC']],
    });
    res.json({ success: true, data: movies });
  } catch (err) {
    next(err);
  }
};

exports.getUpcoming = async (req, res, next) => {
  try {
    const movies = await Movie.findAll({
      where: { status: 'upcoming' },
      order: [['release_date', 'ASC']],
    });
    res.json({ success: true, data: movies });
  } catch (err) {
    next(err);
  }
};

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

exports.searchMovies = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });

    const movies = await Movie.findAll({
      where: { title: { [Op.iLike]: `%${q}%` } },
      limit: 10,
    });
    res.json({ success: true, data: movies });
  } catch (err) {
    next(err);
  }
};
