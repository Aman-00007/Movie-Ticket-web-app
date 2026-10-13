require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

const { sequelize, initializeTables } = require('./config/db');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully on port', process.env.DB_PORT || 4000);
    
    // Run full DDL creation queries for all tables (users with registration columns, etc.)
    await initializeTables();
    
    await sequelize.sync({ alter: false });
    console.log('✅ Database models synchronized');
  } catch (err) {
    console.warn('\n⚠️ [PostgreSQL Notice]');
    console.warn('Could not connect to PostgreSQL:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 CineVerse API running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/health`);
  });
})();
