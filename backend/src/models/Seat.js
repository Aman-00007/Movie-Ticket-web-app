const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Seat = sequelize.define('Seat', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  show_id: { type: DataTypes.UUID, allowNull: false },
  row_label: { type: DataTypes.STRING(5), allowNull: false },
  seat_number: { type: DataTypes.INTEGER, allowNull: false },
  seat_type: { type: DataTypes.ENUM('normal', 'premium', 'vip', 'recliner'), defaultValue: 'normal' },
  price_multiplier: { type: DataTypes.DECIMAL(3, 2), defaultValue: 1.0 },
  status: { type: DataTypes.ENUM('available', 'booked', 'held', 'blocked'), defaultValue: 'available' },
  held_by: { type: DataTypes.UUID }, // user id holding the seat
  held_until: { type: DataTypes.DATE }, // auto-release after this time
}, {
  tableName: 'seats',
  indexes: [
    { fields: ['show_id', 'row_label', 'seat_number'], unique: true },
    { fields: ['show_id', 'status'] },
  ],
});

module.exports = Seat;
