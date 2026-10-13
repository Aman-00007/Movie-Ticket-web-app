require('dotenv').config();
const { Movie, Theatre, Show, Seat, Beverage } = require('./models');

(async () => {
  try {
    const movieCount = await Movie.count();
    const theatreCount = await Theatre.count();
    const showCount = await Show.count();
    const seatCount = await Seat.count();
    const beverageCount = await Beverage.count();

    console.log('\n============================================================');
    console.log('🎬 CINEVERSE POSTGRESQL DATABASE - LIVE VERIFICATION');
    console.log('============================================================');
    console.log('✅ PostgreSQL Database: cineverse (Port 4000)');
    console.log('📊 Total Movies in DB:       ', movieCount);
    console.log('🏛️ Total Theatres in DB:     ', theatreCount);
    console.log('🎟️ Total Active Shows:       ', showCount);
    console.log('🪑 Total Seats Configured:   ', seatCount);
    console.log('🍿 Food & Beverage Items:    ', beverageCount);
    console.log('------------------------------------------------------------');
    console.log('🔥 BLOCKBUSTERS CURRENTLY IN CINEMAS:');
    
    const movies = await Movie.findAll({ order: [['rating', 'DESC']] });
    movies.forEach((m, idx) => {
      console.log(`${idx + 1}. ${m.title} | ⭐ ${m.rating}/5 | [${m.status.toUpperCase()}] | ${m.language.join(', ')}`);
    });

    console.log('------------------------------------------------------------');
    console.log('📍 SAMPLE THEATRES:');
    const theatres = await Theatre.findAll({ limit: 4 });
    theatres.forEach((t) => {
      console.log(`• ${t.name} (${t.city})`);
    });

    console.log('============================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Error querying database:', err);
    process.exit(1);
  }
})();
