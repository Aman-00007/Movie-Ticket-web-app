const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Movie = sequelize.define('Movie', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  genre: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  language: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: ['Hindi'] },
  rating: { type: DataTypes.DECIMAL(3, 1), defaultValue: 0 },
  duration_min: { type: DataTypes.INTEGER, allowNull: false },
  release_date: { type: DataTypes.DATEONLY, allowNull: false },
  poster_url: { type: DataTypes.TEXT, allowNull: false },
  backdrop_url: { type: DataTypes.TEXT },
  banner_url: { type: DataTypes.TEXT },
  trailer_url: { type: DataTypes.TEXT },
  cast: { type: DataTypes.JSONB, defaultValue: [] },
  director: { type: DataTypes.STRING(200) },
  certification: { type: DataTypes.STRING(10), defaultValue: 'UA' },
  age_rating: { type: DataTypes.STRING(10), defaultValue: 'U/A' },
  status: { type: DataTypes.ENUM('now_showing', 'upcoming', 'ended', 'archived'), defaultValue: 'upcoming' },
  votes: { type: DataTypes.INTEGER, defaultValue: 1200 },
}, {
  tableName: 'movies',
});

module.exports = Movie;
