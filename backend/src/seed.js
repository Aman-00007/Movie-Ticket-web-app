require('dotenv').config();
const { sequelize, initializeTables } = require('./config/db');
const { User, Movie, Theatre, Show, Seat, Beverage } = require('./models');
const { REAL_2026_MOVIES } = require('./services/movieData2026');

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to PostgreSQL database (CineVerse on port 4000)...');
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully!');

    // Initialize raw DDL tables if they do not exist
    await initializeTables();

    console.log('🔄 Synchronizing database tables cleanly...');
    await sequelize.sync({ force: true });
    console.log('✅ All PostgreSQL tables cleanly created in CineVerse!');

    // 1. Users
    console.log('👤 Seeding users with secure bcrypt hashed passwords...');
    await User.create({
      name: 'Aman Sharma',
      email: 'user@cineverse.com',
      password: 'password123',
      phone: '+91 9876543210',
      city: 'Mumbai',
      role: 'user',
    });

    await User.create({
      name: 'Cinema Operations Manager',
      email: 'admin@cineverse.com',
      password: 'admin123',
      phone: '+91 9876500000',
      city: 'Mumbai',
      role: 'admin',
    });

    // 2. Real-world 2026 trending cinema blockbusters
    console.log('🎬 Seeding authentic 2026 cinema blockbusters with real posters and trailers...');
    const movies = await Movie.bulkCreate(
      REAL_2026_MOVIES.map((m) => ({
        ...m,
        banner_url: m.backdrop_url,
      }))
    );

    // 3. Theatres in major cities
    console.log('🏛️ Seeding multi-city theatres with coordinates...');
    const theatres = await Theatre.bulkCreate([
      {
        name: 'CineVerse IMAX Palladium',
        address: 'High Street Phoenix, 462 Senapati Bapat Marg, Lower Parel',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400013',
        latitude: 18.9953,
        longitude: 72.8248,
        amenities: ['IMAX with Laser', 'Dolby Atmos', 'Recliner Seats', 'Gourmet Dining', 'Valet Parking'],
        screens: [
          { name: 'IMAX Audi 1', total_seats: 50, formats: ['IMAX 3D', 'Dolby Atmos'] },
          { name: 'Gold Class Audi 2', total_seats: 50, formats: ['2D', '4K Laser'] },
        ],
      },
      {
        name: 'CineVerse Luxe Infiniti',
        address: 'Infiniti Mall, Link Road, Andheri West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400053',
        latitude: 19.1415,
        longitude: 72.8315,
        amenities: ['Dolby Atmos', '4K Laser', 'Recliner Seats', 'Cafe', 'Wheelchair Access'],
        screens: [
          { name: 'Audi 1', total_seats: 50, formats: ['3D', 'Atmos'] },
        ],
      },
      {
        name: 'CineVerse Superplex Select Citywalk',
        address: 'A-3, District Centre, Saket',
        city: 'Delhi NCR',
        state: 'Delhi',
        pincode: '110017',
        latitude: 28.5284,
        longitude: 77.2193,
        amenities: ['IMAX', '4DX', 'Dolby Atmos', 'VIP Lounge'],
        screens: [
          { name: 'IMAX Audi 1', total_seats: 50, formats: ['IMAX', 'Atmos'] },
        ],
      },
      {
        name: 'CineVerse Forum Mall',
        address: 'Hosur Road, Koramangala 7th Block',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560095',
        latitude: 12.9352,
        longitude: 77.6111,
        amenities: ['IMAX with Laser', 'Dolby Atmos', 'Cafe Lounge'],
        screens: [
          { name: 'Audi 1', total_seats: 50, formats: ['3D', 'Laser'] },
        ],
      },
      {
        name: 'CineVerse Prasad’s Large Screen',
        address: 'NTR Gardens, Necklace Road',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500063',
        latitude: 17.4144,
        longitude: 78.4682,
        amenities: ['PCX Giant Screen', 'Dolby Atmos', 'Food Court'],
        screens: [
          { name: 'Giant Screen Audi 1', total_seats: 50, formats: ['3D', 'Atmos'] },
        ],
      },
      {
        name: 'CineVerse Phoenix Marketcity',
        address: 'Viman Nagar, Nagar Road',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411014',
        latitude: 18.5622,
        longitude: 73.9167,
        amenities: ['4DX', 'IMAX Laser', 'Gourmet Lounge'],
        screens: [
          { name: 'Audi 1', total_seats: 50, formats: ['4DX', 'Atmos'] },
        ],
      },
    ]);

    // 4. Beverages & Gourmet Snacks
    console.log('🍿 Seeding cinema food & beverages...');
    await Beverage.bulkCreate([
      {
        name: 'Caramel Crunch Popcorn (Large)',
        category: 'popcorn',
        price: 260.0,
        image_url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&auto=format&fit=crop&q=80',
        description: 'Fresh warm popcorn glazed in rich golden butter caramel.',
        is_vegetarian: true,
      },
      {
        name: 'Classic Butter Popcorn',
        category: 'popcorn',
        price: 220.0,
        image_url: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&auto=format&fit=crop&q=80',
        description: 'Crispy salted corn kernels with generous melted butter drizzle.',
        is_vegetarian: true,
      },
      {
        name: 'Cheesy Jalapeño Nachos',
        category: 'snacks',
        price: 240.0,
        image_url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&auto=format&fit=crop&q=80',
        description: 'Crisp tortilla chips served with warm melted cheese dip and spicy salsa.',
        is_vegetarian: true,
      },
      {
        name: 'Chilled Coca-Cola (Zero Sugar, 500ml)',
        category: 'drinks',
        price: 120.0,
        image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80',
        description: 'Ice-cold bubbly refreshment with zero calories.',
        is_vegetarian: true,
      },
      {
        name: 'Irish Cream Cold Brew Coffee',
        category: 'drinks',
        price: 180.0,
        image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&auto=format&fit=crop&q=80',
        description: 'Velvety smooth slow-steeped iced coffee with hint of Irish cream.',
        is_vegetarian: true,
      },
      {
        name: 'CineVerse Blockbuster Duo Combo',
        category: 'combos',
        price: 499.0,
        image_url: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=400&auto=format&fit=crop&q=80',
        description: '1 Large Popcorn + 2 Large Cold Drinks + 1 Cheesy Nachos (Save 25%!).',
        is_vegetarian: true,
      },
    ]);

    // 5. Shows & Seats
    console.log('🎟️ Seeding showtimes and interactive seat maps for 2026 movies...');
    const showTimes = [
      { start: '10:30:00', format: 'IMAX' },
      { start: '14:15:00', format: '3D' },
      { start: '18:00:00', format: 'IMAX' },
      { start: '21:30:00', format: '4DX' },
    ];

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const dates = [today, tomorrow];

    const nowShowingMovies = movies.filter((m) => m.status === 'now_showing');

    for (const movie of nowShowingMovies) {
      for (const theatre of theatres.slice(0, 3)) {
        for (const date of dates) {
          for (const st of showTimes) {
            const show = await Show.create({
              movie_id: movie.id,
              theatre_id: theatre.id,
              show_date: date,
              show_time: st.start,
              base_price: 250.0,
              format: st.format,
              language: (movie.language && movie.language[0]) || 'Hindi',
              available_seats: 50,
              screen_number: 1,
            });

            // Create seats for this show (Rows A-E, 1-10)
            const rows = [
              { row: 'A', type: 'normal', mult: 1.0 },
              { row: 'B', type: 'normal', mult: 1.0 },
              { row: 'C', type: 'premium', mult: 1.4 },
              { row: 'D', type: 'vip', mult: 1.6 },
              { row: 'E', type: 'recliner', mult: 1.8 },
            ];

            const seatData = [];
            for (const r of rows) {
              for (let num = 1; num <= 10; num++) {
                seatData.push({
                  show_id: show.id,
                  row_label: r.row,
                  seat_number: num,
                  seat_type: r.type,
                  price_multiplier: r.mult,
                  status: 'available',
                });
              }
            }
            await Seat.bulkCreate(seatData);
          }
        }
      }
    }

    console.log('\n🎉 ============================================================');
    console.log('✨ 2026 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('🎬 2026 Movies:', movies.length);
    console.log('🏛️ Theatres:', theatres.length);
    console.log('🎉 ============================================================\n');
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = { seedDatabase };
