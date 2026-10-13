const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Show = sequelize.define('Show', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  movie_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'movies', key: 'id' } },
  theatre_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'theatres', key: 'id' } },
  show_date: { type: DataTypes.DATEONLY, allowNull: false },
  show_time: { type: DataTypes.TIME, allowNull: false },
  format: { type: DataTypes.ENUM('2D', '3D', 'IMAX', '4DX'), defaultValue: '2D' },
  language: { type: DataTypes.STRING(50), defaultValue: 'Hindi' },
  base_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  total_seats: { type: DataTypes.INTEGER, defaultValue: 100 },
  available_seats: { type: DataTypes.INTEGER, defaultValue: 100 },
  screen_number: { type: DataTypes.INTEGER, defaultValue: 1 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'shows',
});

module.exports = Show;
