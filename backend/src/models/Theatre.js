const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Theatre = sequelize.define('Theatre', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  city: { type: DataTypes.STRING(100), allowNull: false },
  state: { type: DataTypes.STRING(100) },
  pincode: { type: DataTypes.STRING(10) },
  latitude: { type: DataTypes.DECIMAL(10, 8) },
  longitude: { type: DataTypes.DECIMAL(11, 8) },
  amenities: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  total_screens: { type: DataTypes.INTEGER, defaultValue: 1 },
  image_url: { type: DataTypes.TEXT },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'theatres',
});

module.exports = Theatre;
