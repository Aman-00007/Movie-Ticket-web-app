const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Beverage = sequelize.define('Beverage', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  category: { type: DataTypes.ENUM('drinks', 'snacks', 'combos', 'desserts'), allowNull: false },
  image_url: { type: DataTypes.TEXT },
  calories: { type: DataTypes.INTEGER },
  is_vegetarian: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_bestseller: { type: DataTypes.BOOLEAN, defaultValue: false },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'beverages',
});

module.exports = Beverage;
