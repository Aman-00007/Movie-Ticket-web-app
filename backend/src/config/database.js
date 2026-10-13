const { Sequelize } = require('sequelize');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 4000;
const user = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || 'postgres';
const database = process.env.DB_NAME || 'cineverse';

const dbUrl = process.env.DATABASE_URL || `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? false : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = { sequelize, Sequelize };
