const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING(20) },
  avatar_url: { type: DataTypes.TEXT },
  city: { type: DataTypes.STRING(100), defaultValue: 'Mumbai' },
  role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'users',
  instanceMethods: {
    comparePassword: async function (plain) {
      return bcrypt.compare(plain, this.password);
    },
    toJSON: function () {
      const vals = { ...this.get() };
      delete vals.password;
      return vals;
    },
  },
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) user.password = await bcrypt.hash(user.password, 12);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) user.password = await bcrypt.hash(user.password, 12);
    },
  },
});

if (User.prototype) {
  User.prototype.comparePassword = async function (plain) {
    return bcrypt.compare(plain, this.password);
  };
  User.prototype.toJSON = function () {
    const vals = { ...this.get() };
    delete vals.password;
    return vals;
  };
}

if (User.Instance && User.Instance.prototype) {
  User.Instance.prototype.comparePassword = async function (plain) {
    return bcrypt.compare(plain, this.password);
  };
  User.Instance.prototype.toJSON = function () {
    const vals = { ...this.get() };
    delete vals.password;
    return vals;
  };
}

module.exports = User;
