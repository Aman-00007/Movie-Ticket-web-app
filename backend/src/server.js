require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

const { sequelize } = require('./config/database');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully on port', process.env.DB_PORT || 4000);
    await sequelize.sync({ alter: false });
    console.log('✅ Database models synchronized');
  } catch (err) {
    console.warn('\n⚠️ [PostgreSQL Notice]');
    console.warn('Could not connect to PostgreSQL:', err.message);
    console.warn('----------------------------------------------------');
    console.warn('📌 HOW TO CONNECT VIA pgAdmin:');
    console.warn('1. Open pgAdmin 4.');
    console.warn('2. Under Servers, connect to PostgreSQL 18 (Port: 4000).');
    console.warn('3. Right-click "Databases" -> Create -> Database...');
    console.warn('4. Enter name: cineverse -> click Save.');
    console.warn('5. Update backend/.env with your pgAdmin password:');
    console.warn('   DB_PASSWORD=your_password_here');
    console.warn('6. Run: npm run seed (in backend folder) to populate movies!');
    console.warn('----------------------------------------------------\n');
  }

  app.listen(PORT, () => {
    console.log(`🚀 CineVerse API running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/health`);
  });
})();
