require('dotenv').config();
const { sequelize, initializeTables } = require('./config/db');
const { User, Movie, Theatre, Show, Seat, Beverage } = require('./models');

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
    const user = await User.create({
      name: 'Aman Sharma',
      email: 'user@cineverse.com',
      password: 'password123',
      phone: '+91 9876543210',
      city: 'Mumbai',
      role: 'user',
    });

    const admin = await User.create({
      name: 'Cinema Operations Manager',
      email: 'admin@cineverse.com',
      password: 'admin123',
      phone: '+91 9876500000',
      city: 'Mumbai',
      role: 'admin',
    });

    // 2. Real-world BookMyShow trending movies with real posters and trailers
    console.log('🎬 Seeding trending cinema blockbusters with real posters and trailers...');
    const movies = await Movie.bulkCreate([
      {
        title: 'Pushpa 2: The Rule',
        description: 'The clash between Pushpa Raj and Bhanwar Singh Shekhawat escalates into an all-out war of supremacy, power, and syndicates.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/1/11/Pushpa_2-_The_Rule.jpg',
        backdrop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/g3JUbgZXflM',
        duration_min: 201,
        rating: 4.9,
        genre: ['Action', 'Thriller', 'Drama'],
        language: ['Hindi', 'Telugu', 'Tamil'],
        release_date: '2024-12-05',
        certification: 'UA',
        status: 'now_showing',
        cast: [
          { name: 'Allu Arjun', role: 'Pushpa Raj' },
          { name: 'Rashmika Mandanna', role: 'Srivalli' },
          { name: 'Fahadh Faasil', role: 'SP Bhanwar Singh Shekhawat' },
        ],
        director: 'Sukumar',
      },
      {
        title: 'Chhaava',
        description: 'The monumental saga of Chhatrapati Sambhaji Maharaj, the valiant second ruler of the Maratha Empire and his unyielding courage against the Mughal army.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/7/75/Chhaava_film_poster.jpg',
        backdrop_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/m_KkYt2Vj8s',
        duration_min: 162,
        rating: 4.9,
        genre: ['Action', 'Drama', 'Period'],
        language: ['Hindi', 'Marathi'],
        release_date: '2025-02-14',
        certification: 'UA',
        status: 'now_showing',
        cast: [
          { name: 'Vicky Kaushal', role: 'Chhatrapati Sambhaji Maharaj' },
          { name: 'Rashmika Mandanna', role: 'Yesubai Bhonsale' },
          { name: 'Akshaye Khanna', role: 'Aurangzeb' },
        ],
        director: 'Laxman Utekar',
      },
      {
        title: 'Bhool Bhulaiyaa 3',
        description: 'Rooh Baba returns to the haunted palace of Raktaghat only to be confronted by not one, but two vengeful spirits claiming to be Manjulika.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/e/e4/Bhool_Bhulaiyaa_3_poster.jpg',
        backdrop_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/5FkXbL_j_c8',
        duration_min: 158,
        rating: 4.7,
        genre: ['Comedy', 'Horror', 'Mystery'],
        language: ['Hindi'],
        release_date: '2024-11-01',
        certification: 'UA',
        status: 'now_showing',
        cast: [
          { name: 'Kartik Aaryan', role: 'Rooh Baba' },
          { name: 'Vidya Balan', role: 'Manjulika' },
          { name: 'Madhuri Dixit', role: 'Mandira' },
        ],
        director: 'Anees Bazmee',
      },
      {
        title: 'Singham Again',
        description: 'DCP Bajirao Singham unites with DCP Veer Sooryavanshi, Inspector Sangram Bhalerao, ACP Satya, and Shakti Shetty on a high-stakes cross-border rescue mission.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/0/04/Singham_Again_poster.jpg',
        backdrop_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/1kVK0mP_32Y',
        duration_min: 165,
        rating: 4.6,
        genre: ['Action', 'Drama', 'Thriller'],
        language: ['Hindi'],
        release_date: '2024-11-01',
        certification: 'UA',
        status: 'now_showing',
        cast: [
          { name: 'Ajay Devgn', role: 'Bajirao Singham' },
          { name: 'Kareena Kapoor Khan', role: 'Avni Kamat' },
          { name: 'Deepika Padukone', role: 'Shakti Shetty' },
          { name: 'Ranveer Singh', role: 'Simmba' },
        ],
        director: 'Rohit Shetty',
      },
      {
        title: 'Gladiator II',
        description: 'Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/0/04/Gladiator_II_%282024%29_poster.jpg',
        backdrop_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/4rgYUipGJNo',
        duration_min: 148,
        rating: 4.8,
        genre: ['Action', 'Adventure', 'Drama'],
        language: ['English', 'Hindi'],
        release_date: '2024-11-15',
        certification: 'A',
        status: 'now_showing',
        cast: [
          { name: 'Paul Mescal', role: 'Lucius Verus' },
          { name: 'Denzel Washington', role: 'Macrinus' },
          { name: 'Pedro Pascal', role: 'General Marcus Acacius' },
        ],
        director: 'Ridley Scott',
      },
      {
        title: 'Mufasa: The Lion King',
        description: 'An orphaned cub lost and alone meets a sympathetic lion named Taka—the heir to a royal bloodline—initiating an expansive journey across the African savanna.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/0/0b/Mufasa_The_Lion_King_Movie_2024.jpeg',
        backdrop_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/o17MF9vnabg',
        duration_min: 118,
        rating: 4.8,
        genre: ['Animation', 'Adventure', 'Family'],
        language: ['English', 'Hindi', 'Tamil'],
        release_date: '2024-12-20',
        certification: 'U',
        status: 'now_showing',
        cast: [
          { name: 'Shah Rukh Khan (Voice)', role: 'Mufasa (Hindi)' },
          { name: 'Aryan Khan (Voice)', role: 'Simba (Hindi)' },
          { name: 'AbRam Khan (Voice)', role: 'Young Mufasa (Hindi)' },
        ],
        director: 'Barry Jenkins',
      },
      {
        title: 'F1: The Apex Pursuit',
        description: 'A retired Formula 1 veteran returns to motorsport to partner and mentor an extraordinary rookie driver at the APXGP racing team.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/3/38/F1_%282025_film%29.png',
        backdrop_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/8v_4O44wvqg',
        duration_min: 145,
        rating: 4.9,
        genre: ['Action', 'Drama', 'Sports'],
        language: ['English', 'Hindi'],
        release_date: '2025-06-27',
        certification: 'UA',
        status: 'now_showing',
        cast: [
          { name: 'Brad Pitt', role: 'Sonny Hayes' },
          { name: 'Damson Idris', role: 'Joshua Pearce' },
          { name: 'Javier Bardem', role: 'Team Principal' },
        ],
        director: 'Joseph Kosinski',
      },
      {
        title: 'Sitaare Zameen Par',
        description: 'An uplifting and humorous sports drama celebrating neurodivergent athletes coached by an unconventional mentor.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Sitaare_Zameen_Par_poster.jpg/500px-Sitaare_Zameen_Par_poster.jpg',
        backdrop_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/6_d0zV5HjD4',
        duration_min: 155,
        rating: 4.8,
        genre: ['Drama', 'Sports', 'Family'],
        language: ['Hindi'],
        release_date: '2025-06-20',
        certification: 'U',
        status: 'now_showing',
        cast: [
          { name: 'Aamir Khan', role: 'Coach' },
          { name: "Genelia D'Souza", role: 'Mentor' },
        ],
        director: 'R. S. Prasanna',
      },
      {
        title: 'Game Changer',
        description: 'An honest Indian Administrative Service (IAS) officer fights against corrupt political dynasties to guarantee free and transparent elections.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/6/6a/Game_Changer_Telugu.jpg',
        backdrop_url: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/gB8jW_D8Krg',
        duration_min: 165,
        rating: 4.7,
        genre: ['Action', 'Thriller', 'Drama'],
        language: ['Telugu', 'Hindi', 'Tamil'],
        release_date: '2025-01-10',
        certification: 'UA',
        status: 'now_showing',
        cast: [
          { name: 'Ram Charan', role: 'Ram Nandan IAS' },
          { name: 'Kiara Advani', role: 'Deepika' },
          { name: 'SJ Suryah', role: 'Bobbili Raja' },
        ],
        director: 'S. Shankar',
      },
      {
        title: 'Baby John',
        description: 'A dedicated former cop assumes a peaceful identity to protect his young daughter, until his violent past reemerges.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Baby_John_%28title_card%29.jpg/500px-Baby_John_%28title_card%29.jpg',
        backdrop_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/fGfE0FjIq20',
        duration_min: 152,
        rating: 4.5,
        genre: ['Action', 'Thriller'],
        language: ['Hindi'],
        release_date: '2024-12-25',
        certification: 'UA',
        status: 'now_showing',
        cast: [
          { name: 'Varun Dhawan', role: 'Baby John' },
          { name: 'Keerthy Suresh', role: 'Pooja' },
          { name: 'Wamiqa Gabbi', role: 'Tara' },
          { name: 'Jackie Shroff', role: 'Babbar Sher' },
        ],
        director: 'Kalees',
      },
      {
        title: 'Captain America: Brave New World',
        description: 'Sam Wilson finds himself in the middle of an international incident as he must discover the motive behind a nefarious global plot before the mastermind has the entire world seeing red.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Captain_America_Brave_New_World_poster.jpg',
        backdrop_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/1pHDWnXmKMY',
        duration_min: 118,
        rating: 4.8,
        genre: ['Action', 'Sci-Fi', 'Adventure'],
        language: ['English', 'Hindi'],
        release_date: '2025-02-14',
        certification: 'UA',
        status: 'upcoming',
        cast: [
          { name: 'Anthony Mackie', role: 'Sam Wilson / Captain America' },
          { name: 'Harrison Ford', role: 'President Thaddeus Ross / Red Hulk' },
          { name: 'Giancarlo Esposito', role: 'Sidewinder' },
        ],
        director: 'Julius Onah',
      },
      {
        title: 'Kannappa',
        description: 'The monumental tale of the supreme devotee of Lord Shiva with divine battles and spiritual grandeur.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/e/ed/Kannappa_%28film%29.jpg',
        backdrop_url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/hJ5f_F53aQY',
        duration_min: 165,
        rating: 4.6,
        genre: ['Action', 'Mythology', 'Drama'],
        language: ['Telugu', 'Hindi', 'Tamil'],
        release_date: '2025-07-04',
        certification: 'UA',
        status: 'upcoming',
        cast: [
          { name: 'Vishnu Manchu', role: 'Kannappa' },
          { name: 'Prabhas', role: 'Rudra' },
          { name: 'Akshay Kumar', role: 'Mahadeva' },
        ],
        director: 'Mukesh Kumar Singh',
      },
      {
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg',
        backdrop_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/Way9Dexny3w',
        duration_min: 166,
        rating: 4.9,
        genre: ['Sci-Fi', 'Adventure', 'Action'],
        language: ['English', 'Hindi'],
        release_date: '2024-03-01',
        certification: 'UA',
        status: 'now_showing',
        cast: [
          { name: 'Timothée Chalamet', role: 'Paul Atreides' },
          { name: 'Zendaya', role: 'Chani' },
          { name: 'Rebecca Ferguson', role: 'Lady Jessica' },
        ],
        director: 'Denis Villeneuve',
      },
      {
        title: 'Deadpool & Wolverine',
        description: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary Deadpool behind him, until the Time Variance Authority pulls him into a new mission alongside Wolverine.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Deadpool_%26_Wolverine_poster.jpg',
        backdrop_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/73_1biulkYk',
        duration_min: 128,
        rating: 4.8,
        genre: ['Action', 'Comedy', 'Sci-Fi'],
        language: ['English', 'Hindi'],
        release_date: '2024-07-26',
        certification: 'A',
        status: 'now_showing',
        cast: [
          { name: 'Ryan Reynolds', role: 'Wade Wilson / Deadpool' },
          { name: 'Hugh Jackman', role: 'Logan / Wolverine' },
          { name: 'Emma Corrin', role: 'Cassandra Nova' },
        ],
        director: 'Shawn Levy',
      },
      {
        title: 'Kalki 2898 AD',
        description: 'In the post-apocalyptic city of Kasi in the year 2898 AD, a battle erupts to protect the unborn avatar of Lord Vishnu from the tyrannical ruler Supreme Yaskin.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg',
        backdrop_url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/kQDd1AhGIHk',
        duration_min: 181,
        rating: 4.8,
        genre: ['Sci-Fi', 'Action', 'Mythology'],
        language: ['Telugu', 'Hindi', 'Tamil'],
        release_date: '2024-06-27',
        certification: 'UA',
        status: 'now_showing',
        cast: [
          { name: 'Prabhas', role: 'Bhairava' },
          { name: 'Amitabh Bachchan', role: 'Ashwatthama' },
          { name: 'Kamal Haasan', role: 'Supreme Yaskin' },
          { name: 'Deepika Padukone', role: 'SUM-80' },
        ],
        director: 'Nag Ashwin',
      },
      {
        title: 'Stree 2: Sarkate Ka Aatank',
        description: 'The town of Chanderi is haunted once again, this time by a headless entity named Sarkata that abducts modern progressive women.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Stree_2_poster.jpg/500px-Stree_2_poster.jpg',
        backdrop_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/KVnhe_Egw5w',
        duration_min: 147,
        rating: 4.8,
        genre: ['Comedy', 'Horror'],
        language: ['Hindi'],
        release_date: '2024-08-15',
        certification: 'UA',
        status: 'now_showing',
        cast: [
          { name: 'Rajkummar Rao', role: 'Vicky' },
          { name: 'Shraddha Kapoor', role: 'She' },
          { name: 'Pankaj Tripathi', role: 'Rudra' },
        ],
        director: 'Amar Kaushik',
      },
      {
        title: 'Superman (2025)',
        description: 'Superman reconciles his alien Kryptonian heritage with his human upbringing in Smallville, Kansas, guiding humanity with truth and justice.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/23/Superman_%282025_film%29_poster.jpg/500px-Superman_%282025_film%29_poster.jpg',
        backdrop_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/1pHDWnXmKMY',
        duration_min: 145,
        rating: 4.9,
        genre: ['Action', 'Sci-Fi', 'Adventure'],
        language: ['English', 'Hindi'],
        release_date: '2025-07-11',
        certification: 'UA',
        status: 'upcoming',
        cast: [
          { name: 'David Corenswet', role: 'Clark Kent / Superman' },
          { name: 'Rachel Brosnahan', role: 'Lois Lane' },
          { name: 'Nicholas Hoult', role: 'Lex Luthor' },
        ],
        director: 'James Gunn',
      },
      {
        title: 'War 2',
        description: 'Major Kabir Dhaliwal confronts a rogue intelligence asset of immense lethality in a high-octane global manhunt across continents.',
        poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
        backdrop_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/1kVK0mP_32Y',
        duration_min: 160,
        rating: 4.8,
        genre: ['Action', 'Thriller'],
        language: ['Hindi', 'Telugu', 'Tamil'],
        release_date: '2025-08-14',
        certification: 'UA',
        status: 'upcoming',
        cast: [
          { name: 'Hrithik Roshan', role: 'Major Kabir Dhaliwal' },
          { name: 'Jr NTR', role: 'Agent Vikram' },
          { name: 'Kiara Advani', role: 'Tara' },
        ],
        director: 'Ayan Mukerji',
      },
      {
        title: 'Avatar: Fire and Ash',
        description: 'Jake Sully and Neytiri encounter the Ash People, a more aggressive and volatile clan of Na’vi dwelling among volcanic regions of Pandora.',
        poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        backdrop_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/4rgYUipGJNo',
        duration_min: 190,
        rating: 4.9,
        genre: ['Sci-Fi', 'Adventure', 'Action'],
        language: ['English', 'Hindi'],
        release_date: '2025-12-19',
        certification: 'UA',
        status: 'upcoming',
        cast: [
          { name: 'Sam Worthington', role: 'Jake Sully' },
          { name: 'Zoe Saldaña', role: 'Neytiri' },
          { name: 'Sigourney Weaver', role: 'Kiri' },
        ],
        director: 'James Cameron',
      },
    ]);

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
    console.log('🎟️ Seeding showtimes and interactive seat maps...');
    const showTimes = [
      { start: '10:30:00', format: 'IMAX' },
      { start: '14:15:00', format: '3D' },
      { start: '18:00:00', format: 'IMAX' },
      { start: '21:30:00', format: '4DX' },
    ];

    const today = new Date().toISOString().split('T')[0];

    // Seed shows for the top now-showing movies in theatres
    for (const movie of movies.slice(0, 6)) {
      for (const theatre of theatres.slice(0, 3)) {
        for (const st of showTimes) {
          const show = await Show.create({
            movie_id: movie.id,
            theatre_id: theatre.id,
            show_date: today,
            show_time: st.start,
            base_price: 250.0,
            format: st.format,
            language: movie.language[0] || 'Hindi',
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

    console.log('🎉 PostgreSQL Database "CineVerse" successfully seeded with real movie posters, trailers, multi-city theatres, and showtimes!');
    console.log('✅ Demo Credentials ready:');
    console.log('   User:  user@cineverse.com  / password123');
    console.log('   Admin: admin@cineverse.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
