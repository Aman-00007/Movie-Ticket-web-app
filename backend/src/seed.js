require('dotenv').config();
const { sequelize } = require('./config/database');
const { User, Movie, Theatre, Show, Seat, Beverage } = require('./models');

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to PostgreSQL database...');
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('🧹 Tables created and synced cleanly.');

    // 1. Users
    console.log('👤 Seeding users...');
    const user = await User.create({
      name: 'Aman Sharma',
      email: 'user@cineverse.com',
      password: 'password123',
      phone: '+91 9876543210',
      city: 'Mumbai',
      role: 'user',
    });

    const admin = await User.create({
      name: 'Cinema Manager',
      email: 'admin@cineverse.com',
      password: 'admin123',
      phone: '+91 9876500000',
      city: 'Mumbai',
      role: 'admin',
    });

    // 2. Movies
    console.log('🎬 Seeding movies...');
    const movies = await Movie.bulkCreate([
      {
        title: 'Sitaare Zameen Par',
        description: 'An uplifting and emotional sports drama centered around down syndrome athletes, directed by R. S. Prasanna and starring Aamir Khan.',
        poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
        backdrop_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_min: 155,
        rating: 4.8,
        genre: ['Drama', 'Sports', 'Family'],
        language: ['Hindi'],
        release_date: '2025-06-20',
        certification: 'U',
        status: 'now_showing',
        cast: [
          { name: 'Aamir Khan', role: 'Coach', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
          { name: 'Genelia D\'Souza', role: 'Mentor', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
        ],
        director: 'R. S. Prasanna',
      },
      {
        title: 'F1: The Apex Pursuit',
        description: 'A retired Formula 1 driver returns to the grid to mentor an upcoming rookie prodigy at the fictional APXGP team.',
        poster_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
        backdrop_url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_min: 148,
        rating: 4.9,
        genre: ['Action', 'Drama', 'Sports'],
        language: ['English', 'Hindi'],
        release_date: '2025-06-27',
        certification: 'UA',
        status: 'now_showing',
        cast: [
          { name: 'Brad Pitt', role: 'Sonny Hayes', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
          { name: 'Damson Idris', role: 'Joshua Pearce', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200' },
        ],
        director: 'Joseph Kosinski',
      },
      {
        title: 'Kannappa',
        description: 'The legendary tale of the supreme devotee of Lord Shiva, featuring epic battle sequences and spiritual grandeur.',
        poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
        backdrop_url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_min: 165,
        rating: 4.6,
        genre: ['Action', 'Mythology', 'Drama'],
        language: ['Telugu', 'Hindi', 'Tamil'],
        release_date: '2025-07-04',
        certification: 'UA',
        status: 'now_showing',
        cast: [
          { name: 'Vishnu Manchu', role: 'Kannappa', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
          { name: 'Prabhas', role: 'Rudra', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200' },
        ],
        director: 'Mukesh Kumar Singh',
      },
      {
        title: 'Housefull 5',
        description: 'The mega-comedy franchise takes to the high seas on a luxury cruise liner with double the confusion, laughter, and madness.',
        poster_url: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=800&auto=format&fit=crop&q=80',
        backdrop_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_min: 140,
        rating: 4.2,
        genre: ['Comedy'],
        language: ['Hindi'],
        release_date: '2025-06-06',
        certification: 'UA',
        status: 'now_showing',
        cast: [
          { name: 'Akshay Kumar', role: 'Harry', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200' },
          { name: 'Riteish Deshmukh', role: 'Roy', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
        ],
        director: 'Tarun Mansukhani',
      },
      {
        title: 'M3GAN 2.0',
        description: 'The AI doll returns with military-grade upgrades, deeper autonomy, and an unyielding mission to protect her best friend.',
        poster_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
        backdrop_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_min: 112,
        rating: 4.4,
        genre: ['Sci-Fi', 'Horror', 'Thriller'],
        language: ['English', 'Hindi'],
        release_date: '2025-06-27',
        certification: 'A',
        status: 'now_showing',
        cast: [
          { name: 'Allison Williams', role: 'Gemma', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' },
          { name: 'Violet McGraw', role: 'Cady', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200' },
        ],
        director: 'Gerard Johnstone',
      },
      {
        title: 'How to Train Your Dragon (Live Action)',
        description: 'The beloved saga of Hiccup and Toothless comes alive in breathtaking photorealistic live action across the Isle of Berk.',
        poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
        backdrop_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_min: 135,
        rating: 4.9,
        genre: ['Fantasy', 'Adventure', 'Family'],
        language: ['English', 'Hindi'],
        release_date: '2025-06-13',
        certification: 'U',
        status: 'now_showing',
        cast: [
          { name: 'Mason Thames', role: 'Hiccup', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200' },
          { name: 'Nico Parker', role: 'Astrid', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200' },
        ],
        director: 'Dean DeBlois',
      },
      {
        title: 'Maa',
        description: 'A heartwarming story about sacrifice, motherhood, and triumphant resilience in rural India.',
        poster_url: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&auto=format&fit=crop&q=80',
        backdrop_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_min: 130,
        rating: 4.5,
        genre: ['Drama', 'Family'],
        language: ['Hindi'],
        release_date: '2025-08-15',
        certification: 'U',
        status: 'upcoming',
        cast: [{ name: 'Kangana Ranaut', role: 'Devi', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200' }],
        director: 'Aanand L. Rai',
      },
    ]);

    // 3. Theatres
    console.log('🏛️ Seeding theatres...');
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
          { name: 'IMAX Audi 1', total_seats: 80, formats: ['IMAX 3D', 'Dolby Atmos'] },
          { name: 'Gold Class Audi 2', total_seats: 60, formats: ['2D', '4K Laser'] },
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
          { name: 'Audi 1', total_seats: 80, formats: ['3D', 'Atmos'] },
        ],
      },
      {
        name: 'CineVerse Superplex Select Citywalk',
        address: 'A-3, District Centre, Saket',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110017',
        latitude: 28.5284,
        longitude: 77.2193,
        amenities: ['IMAX', '4DX', 'Dolby Atmos', 'VIP Lounge'],
        screens: [
          { name: 'IMAX Audi 1', total_seats: 80, formats: ['IMAX', 'Atmos'] },
        ],
      },
      {
        name: 'CineVerse Forum Mall',
        address: 'Hosur Road, Koramangala',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560095',
        latitude: 12.9352,
        longitude: 77.6111,
        amenities: ['IMAX with Laser', 'Dolby Atmos', 'Cafe Lounge'],
        screens: [
          { name: 'Audi 1', total_seats: 80, formats: ['3D', 'Laser'] },
        ],
      },
    ]);

    // 4. Beverages & Snacks
    console.log('🍿 Seeding beverages and snacks...');
    await Beverage.bulkCreate([
      {
        name: 'Caramel Crunch Popcorn (Large)',
        category: 'popcorn',
        price: 260.0,
        image_url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&auto=format&fit=crop&q=80',
        description: 'Freshly popped warm popcorn coated in rich golden butter caramel.',
        is_vegetarian: true,
      },
      {
        name: 'Movie Classic Butter Popcorn',
        category: 'popcorn',
        price: 220.0,
        image_url: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&auto=format&fit=crop&q=80',
        description: 'Crispy salted corn kernels with generous melted butter drizzle.',
        is_vegetarian: true,
      },
      {
        name: 'Cheesy Jalapeno Nachos',
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
        description: '1 Large Popcorn + 2 Large Cold Drinks + 1 Cheesy Nachos. Save 25%!',
        is_vegetarian: true,
      },
    ]);

    // 5. Shows & Seats
    console.log('🎟️ Seeding shows and seat layouts...');
    const showTimes = [
      { start: '10:30:00', end: '13:00:00', format: '2D' },
      { start: '14:15:00', end: '17:00:00', format: 'IMAX 3D' },
      { start: '18:00:00', end: '20:45:00', format: 'Dolby Atmos' },
      { start: '21:30:00', end: '00:15:00', format: 'IMAX 3D' },
    ];

    const today = new Date().toISOString().split('T')[0];

    for (const movie of movies.slice(0, 4)) {
      for (const theatre of theatres.slice(0, 2)) {
        for (const st of showTimes) {
          const show = await Show.create({
            movie_id: movie.id,
            theatre_id: theatre.id,
            screen_name: 'IMAX Audi 1',
            show_date: today,
            start_time: st.start,
            end_time: st.end,
            base_price: 250.0,
            format: st.format,
            language: movie.language[0] || 'Hindi',
            available_seats: 50,
          });

          // Create seats for this show (Rows A-E, 1-10)
          const rows = [
            { row: 'A', type: 'silver', mult: 1.0 },
            { row: 'B', type: 'silver', mult: 1.0 },
            { row: 'C', type: 'gold', mult: 1.4 },
            { row: 'D', type: 'gold', mult: 1.4 },
            { row: 'E', type: 'platinum', mult: 1.8 },
          ];

          const seatData = [];
          for (const r of rows) {
            for (let num = 1; num <= 10; num++) {
              // Pre-book a couple of seats for realism
              const isBooked = (r.row === 'C' && (num === 4 || num === 5)) || (r.row === 'D' && num === 8);
              seatData.push({
                show_id: show.id,
                row_label: r.row,
                seat_number: num,
                seat_type: r.type,
                price_multiplier: r.mult,
                status: isBooked ? 'booked' : 'available',
              });
            }
          }
          await Seat.bulkCreate(seatData);
        }
      }
    }

    console.log('✅ Seeding completed successfully!');
    console.log('🎉 Credentials created:');
    console.log('   User:  user@cineverse.com  / password123');
    console.log('   Admin: admin@cineverse.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
