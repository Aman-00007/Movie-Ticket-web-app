const { Beverage } = require('../models');

exports.getBeverages = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = { is_available: true };
    if (category) where.category = category;

    const beverages = await Beverage.findAll({ where, order: [['sort_order', 'ASC'], ['name', 'ASC']] });
    res.json({ success: true, data: beverages });
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    res.json({ success: true, data: ['drinks', 'snacks', 'combos', 'desserts'] });
  } catch (err) {
    next(err);
  }
};
