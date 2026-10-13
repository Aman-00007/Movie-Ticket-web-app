const { Theatre } = require('../models');

exports.getTheatres = async (req, res, next) => {
  try {
    const { city } = req.query;
    const where = { is_active: true };
    if (city) where.city = { $iLike: `%${city}%` };
    const theatres = await Theatre.findAll({ where });
    res.json({ success: true, data: theatres });
  } catch (err) {
    next(err);
  }
};

exports.getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByPk(req.params.id);
    if (!theatre) return res.status(404).json({ success: false, message: 'Theatre not found' });
    res.json({ success: true, data: theatre });
  } catch (err) {
    next(err);
  }
};
