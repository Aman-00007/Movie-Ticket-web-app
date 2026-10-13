const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  show_id: { type: DataTypes.UUID, allowNull: false },
  booking_code: { type: DataTypes.STRING(12), unique: true },
  seats: { type: DataTypes.JSONB, defaultValue: [] },
  beverages: { type: DataTypes.JSONB, defaultValue: [] },
  ticket_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  beverage_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  convenience_fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  discount_code: { type: DataTypes.STRING(20) },
  discount_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  payment_status: { type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'), defaultValue: 'pending' },
  stripe_payment_intent_id: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'), defaultValue: 'pending' },
  qr_code: { type: DataTypes.TEXT },
}, {
  tableName: 'bookings',
  hooks: {
    beforeCreate: (booking) => {
      // Generate short booking code like BMS-XXXXXX
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = 'CV-';
      for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
      booking.booking_code = code;
    },
  },
});

module.exports = Booking;
