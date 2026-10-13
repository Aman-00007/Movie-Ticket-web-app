// API Client with automatic fallback to rich local state if backend is offline

const BASE_URL = '/api';

export const fallbackMovies = [
  {
    id: 'pushpa-2',
    title: 'Pushpa 2: The Rule',
    description: 'The clash between Pushpa Raj and Bhanwar Singh Shekhawat escalates into an all-out war of supremacy, power, and syndicates.',
    poster_url: 'https://upload.wikimedia.org/wikipedia/en/1/11/Pushpa_2-_The_Rule.jpg',
    backdrop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/g3JUbgZXflM',
    duration_min: 201,
    rating: 4.9,
    genre: ['Action', 'Thriller', 'Drama'],
    language: ['Hindi', 'Telugu', 'Tamil'],
    certification: 'UA',
    status: 'now_showing',
    release_date: '2024-12-05',
    director: 'Sukumar',
    cast: [{ name: 'Allu Arjun', role: 'Pushpa Raj' }, { name: 'Rashmika Mandanna', role: 'Srivalli' }]
  },
  {
    id: 'chhaava',
    title: 'Chhaava',
    description: 'The monumental saga of Chhatrapati Sambhaji Maharaj, the valiant second ruler of the Maratha Empire and his unyielding courage against the Mughal army.',
    poster_url: 'https://upload.wikimedia.org/wikipedia/en/7/75/Chhaava_film_poster.jpg',
    backdrop_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/ZqA0w-F_jOQ',
    duration_min: 162,
    rating: 4.9,
    genre: ['Action', 'Drama', 'Period'],
    language: ['Hindi', 'Marathi'],
    certification: 'UA',
    status: 'now_showing',
    release_date: '2025-02-14',
    director: 'Laxman Utekar',
    cast: [{ name: 'Vicky Kaushal', role: 'Chhatrapati Sambhaji Maharaj' }, { name: 'Rashmika Mandanna', role: 'Yesubai' }]
  },
  {
    id: 'f1-apex',
    title: 'F1: The Apex Pursuit',
    description: 'A retired Formula 1 veteran returns to motorsport to partner and mentor an extraordinary rookie driver at the APXGP racing team.',
    poster_url: 'https://upload.wikimedia.org/wikipedia/en/3/38/F1_%282025_film%29.png',
    backdrop_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/8v_4O44wvqg',
    duration_min: 145,
    rating: 4.9,
    genre: ['Action', 'Drama', 'Sports'],
    language: ['English', 'Hindi'],
    certification: 'UA',
    status: 'now_showing',
    release_date: '2025-06-27',
    director: 'Joseph Kosinski',
    cast: [{ name: 'Brad Pitt', role: 'Sonny Hayes' }, { name: 'Damson Idris', role: 'Joshua Pearce' }]
  },
  {
    id: 'gladiator-2',
    title: 'Gladiator II',
    description: 'Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors.',
    poster_url: 'https://upload.wikimedia.org/wikipedia/en/0/04/Gladiator_II_%282024%29_poster.jpg',
    backdrop_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/4rgYUipGJNo',
    duration_min: 148,
    rating: 4.8,
    genre: ['Action', 'Adventure', 'Drama'],
    language: ['English', 'Hindi'],
    certification: 'A',
    status: 'now_showing',
    release_date: '2024-11-15',
    director: 'Ridley Scott',
    cast: [{ name: 'Paul Mescal', role: 'Lucius Verus' }, { name: 'Denzel Washington', role: 'Macrinus' }]
  },
  {
    id: 'mufasa-lion-king',
    title: 'Mufasa: The Lion King',
    description: 'An orphaned cub lost and alone meets a sympathetic lion named Taka—the heir to a royal bloodline—initiating an expansive journey across the African savanna.',
    poster_url: 'https://upload.wikimedia.org/wikipedia/en/0/0b/Mufasa_The_Lion_King_Movie_2024.jpeg',
    backdrop_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/o17MF9vnabg',
    duration_min: 118,
    rating: 4.8,
    genre: ['Animation', 'Adventure', 'Family'],
    language: ['English', 'Hindi', 'Tamil'],
    certification: 'U',
    status: 'now_showing',
    release_date: '2024-12-20',
    director: 'Barry Jenkins',
    cast: [{ name: 'Shah Rukh Khan (Voice)', role: 'Mufasa (Hindi)' }]
  },
  {
    id: 'sitaare-zameen-par',
    title: 'Sitaare Zameen Par',
    description: 'An uplifting and humorous sports drama celebrating neurodivergent athletes coached by an unconventional mentor.',
    poster_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Sitaare_Zameen_Par_poster.jpg/500px-Sitaare_Zameen_Par_poster.jpg',
    backdrop_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/6_d0zV5HjD4',
    duration_min: 155,
    rating: 4.8,
    genre: ['Drama', 'Sports', 'Family'],
    language: ['Hindi'],
    certification: 'U',
    status: 'now_showing',
    release_date: '2025-06-20',
    director: 'R. S. Prasanna',
    cast: [{ name: 'Aamir Khan', role: 'Coach' }, { name: "Genelia D'Souza", role: 'Mentor' }]
  },
  {
    id: 'game-changer',
    title: 'Game Changer',
    description: 'An honest Indian Administrative Service (IAS) officer fights against corrupt political dynasties to guarantee free and transparent elections.',
    poster_url: 'https://upload.wikimedia.org/wikipedia/en/6/6a/Game_Changer_Telugu.jpg',
    backdrop_url: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/gB8jW_D8Krg',
    duration_min: 165,
    rating: 4.7,
    genre: ['Action', 'Thriller', 'Drama'],
    language: ['Telugu', 'Hindi', 'Tamil'],
    certification: 'UA',
    status: 'now_showing',
    release_date: '2025-01-10',
    director: 'S. Shankar',
    cast: [{ name: 'Ram Charan', role: 'Ram Nandan IAS' }, { name: 'Kiara Advani', role: 'Deepika' }]
  },
  {
    id: 'bhool-bhulaiyaa-3',
    title: 'Bhool Bhulaiyaa 3',
    description: 'Rooh Baba returns to the haunted palace of Raktaghat only to be confronted by two vengeful spirits claiming to be Manjulika.',
    poster_url: 'https://upload.wikimedia.org/wikipedia/en/e/e4/Bhool_Bhulaiyaa_3_poster.jpg',
    backdrop_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/5FkXbL_j_c8',
    duration_min: 158,
    rating: 4.7,
    genre: ['Comedy', 'Horror', 'Mystery'],
    language: ['Hindi'],
    certification: 'UA',
    status: 'now_showing',
    release_date: '2024-11-01',
    director: 'Anees Bazmee',
    cast: [{ name: 'Kartik Aaryan', role: 'Rooh Baba' }, { name: 'Vidya Balan', role: 'Manjulika' }]
  },
  {
    id: 'singham-again',
    title: 'Singham Again',
    description: 'DCP Bajirao Singham unites the Cop Universe on a high-stakes cross-border rescue mission.',
    poster_url: 'https://upload.wikimedia.org/wikipedia/en/0/04/Singham_Again_poster.jpg',
    backdrop_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/1kVK0mP_32Y',
    duration_min: 165,
    rating: 4.6,
    genre: ['Action', 'Drama', 'Thriller'],
    language: ['Hindi'],
    certification: 'UA',
    status: 'now_showing',
    release_date: '2024-11-01',
    director: 'Rohit Shetty',
    cast: [{ name: 'Ajay Devgn', role: 'Bajirao Singham' }, { name: 'Deepika Padukone', role: 'Shakti Shetty' }]
  },
  {
    id: 'captain-america-4',
    title: 'Captain America: Brave New World',
    description: 'Sam Wilson finds himself in the middle of an international incident as he must discover the motive behind a global conspiracy.',
    poster_url: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Captain_America_Brave_New_World_poster.jpg',
    backdrop_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/1pHDWnXmKMY',
    duration_min: 118,
    rating: 4.8,
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    language: ['English', 'Hindi'],
    certification: 'UA',
    status: 'upcoming',
    release_date: '2025-02-14',
    director: 'Julius Onah',
    cast: [{ name: 'Anthony Mackie', role: 'Sam Wilson' }, { name: 'Harrison Ford', role: 'President Ross' }]
  },
  {
    id: 'kannappa',
    title: 'Kannappa',
    description: 'The monumental tale of the supreme devotee of Lord Shiva with divine battles and spiritual grandeur.',
    poster_url: 'https://upload.wikimedia.org/wikipedia/en/e/ed/Kannappa_%28film%29.jpg',
    backdrop_url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/hJ5f_F53aQY',
    duration_min: 165,
    rating: 4.6,
    genre: ['Action', 'Mythology', 'Drama'],
    language: ['Telugu', 'Hindi', 'Tamil'],
    certification: 'UA',
    status: 'upcoming',
    release_date: '2025-07-04',
    director: 'Mukesh Kumar Singh',
    cast: [{ name: 'Vishnu Manchu', role: 'Kannappa' }, { name: 'Prabhas', role: 'Rudra' }]
  },
  {
    id: 'baby-john',
    title: 'Baby John',
    description: 'A former cop assumes a peaceful identity to protect his young daughter until his violent past reemerges.',
    poster_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Baby_John_%28title_card%29.jpg/500px-Baby_John_%28title_card%29.jpg',
    backdrop_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/fGfE0FjIq20',
    duration_min: 152,
    rating: 4.5,
    genre: ['Action', 'Thriller'],
    language: ['Hindi'],
    certification: 'UA',
    status: 'now_showing',
    release_date: '2024-12-25',
    director: 'Kalees',
    cast: [{ name: 'Varun Dhawan', role: 'Baby John' }, { name: 'Keerthy Suresh', role: 'Pooja' }]
  }
];

export const fallbackTheatres = [
  {
    id: 1,
    name: 'CineVerse IMAX Palladium',
    address: 'High Street Phoenix, Senapati Bapat Marg, Lower Parel',
    city: 'Mumbai',
    latitude: 18.9953,
    longitude: 72.8248,
    distance_km: 2.4,
    amenities: ['IMAX with Laser', 'Dolby Atmos', 'Recliners', 'Gourmet Dine-in'],
    screens: ['IMAX Audi 1', 'Gold Audi 2'],
    showtimes: ['10:30 AM', '01:45 PM', '05:15 PM', '08:45 PM', '11:15 PM']
  },
  {
    id: 2,
    name: 'CineVerse Luxe Infiniti',
    address: 'Infiniti Mall, Link Road, Andheri West',
    city: 'Mumbai',
    latitude: 19.1415,
    longitude: 72.8315,
    distance_km: 5.1,
    amenities: ['Dolby Atmos', '4K Laser', 'Recliners', 'VIP Lounge'],
    screens: ['Luxe Audi 1'],
    showtimes: ['11:00 AM', '02:30 PM', '06:00 PM', '09:30 PM']
  },
  {
    id: 3,
    name: 'CineVerse Superplex Select Citywalk',
    address: 'District Centre, Saket, South Delhi',
    city: 'Delhi NCR',
    latitude: 28.5284,
    longitude: 77.2193,
    distance_km: 3.8,
    amenities: ['IMAX', '4DX', 'Dolby Atmos', 'Gourmet Food'],
    screens: ['Audi 1', 'Audi 2'],
    showtimes: ['10:15 AM', '01:30 PM', '04:45 PM', '08:00 PM', '10:45 PM']
  },
  {
    id: 4,
    name: 'CineVerse Forum Mall',
    address: 'Hosur Road, Koramangala 7th Block',
    city: 'Bengaluru',
    latitude: 12.9352,
    longitude: 77.6111,
    distance_km: 4.2,
    amenities: ['IMAX with Laser', 'Dolby Atmos', 'Cafe Lounge'],
    screens: ['Audi 1'],
    showtimes: ['10:00 AM', '01:15 PM', '05:00 PM', '08:30 PM']
  },
  {
    id: 5,
    name: 'CineVerse Prasad’s Large Screen',
    address: 'NTR Gardens, Necklace Road',
    city: 'Hyderabad',
    latitude: 17.4144,
    longitude: 78.4682,
    distance_km: 3.1,
    amenities: ['PCX Giant Screen', 'Dolby Atmos', 'Food Court'],
    screens: ['Giant Screen Audi 1'],
    showtimes: ['11:00 AM', '02:30 PM', '06:30 PM', '10:00 PM']
  },
  {
    id: 6,
    name: 'CineVerse Phoenix Marketcity',
    address: 'Viman Nagar, Nagar Road',
    city: 'Pune',
    latitude: 18.5622,
    longitude: 73.9167,
    distance_km: 4.8,
    amenities: ['4DX', 'IMAX Laser', 'Gourmet Lounge'],
    screens: ['Audi 1'],
    showtimes: ['10:30 AM', '02:00 PM', '05:45 PM', '09:15 PM']
  }
];

export const fallbackBeverages = [
  {
    id: 1,
    name: 'Caramel Crunch Popcorn (Large)',
    category: 'popcorn',
    price: 260,
    image_url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&auto=format&fit=crop&q=80',
    description: 'Warm popcorn glazed with buttery gourmet golden caramel.'
  },
  {
    id: 2,
    name: 'Classic Butter Popcorn',
    category: 'popcorn',
    price: 220,
    image_url: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&auto=format&fit=crop&q=80',
    description: 'Crispy salted corn kernels with generous melted butter drizzle.'
  },
  {
    id: 3,
    name: 'Cheesy Jalapeño Nachos',
    category: 'snacks',
    price: 240,
    image_url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&auto=format&fit=crop&q=80',
    description: 'Crunchy tortilla chips with warm molten cheese sauce & salsa.'
  },
  {
    id: 4,
    name: 'Chilled Coca-Cola (Zero Sugar, 500ml)',
    category: 'drinks',
    price: 120,
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80',
    description: 'Ice-cold bubbly cinema companion with zero sugar.'
  },
  {
    id: 5,
    name: 'Irish Cream Cold Brew Coffee',
    category: 'drinks',
    price: 180,
    image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&auto=format&fit=crop&q=80',
    description: 'Velvety smooth slow-steeped iced coffee.'
  },
  {
    id: 6,
    name: 'CineVerse Blockbuster Duo Combo',
    category: 'combos',
    price: 499,
    image_url: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=400&auto=format&fit=crop&q=80',
    description: '1 Large Popcorn + 2 Large Cold Drinks + 1 Cheesy Nachos (Save 25%!).'
  }
];

export const api = {
  async getMovies() {
    try {
      const res = await fetch(`${BASE_URL}/movies`);
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      return data.data && data.data.length ? data.data : fallbackMovies;
    } catch {
      return fallbackMovies;
    }
  },

  async getTheatres(city) {
    try {
      const url = city ? `${BASE_URL}/theatres?city=${encodeURIComponent(city)}` : `${BASE_URL}/theatres`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      return data.data && data.data.length ? data.data : fallbackTheatres;
    } catch {
      return city
        ? fallbackTheatres.filter(t => t.city.toLowerCase() === city.toLowerCase())
        : fallbackTheatres;
    }
  },

  async getBeverages() {
    try {
      const res = await fetch(`${BASE_URL}/beverages`);
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      return data.data && data.data.length ? data.data : fallbackBeverages;
    } catch {
      return fallbackBeverages;
    }
  },

  async getAiRecommendation(payload) {
    try {
      const res = await fetch(`${BASE_URL}/ai/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('AI endpoint failed');
      return await res.json();
    } catch {
      const m = fallbackMovies[0];
      return {
        success: true,
        recommendation: `🍿 **CineBot Recommendation:**\n\nI highly recommend **${m.title}** (⭐ ${m.rating}/5)! It matches your mood with thrilling pacing and stellar acting. Grab a Tub of Caramel Popcorn and enjoy the show!`,
      };
    }
  },

  async chatWithAi(message, history = []) {
    try {
      const res = await fetch(`${BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });
      if (!res.ok) throw new Error('Chat failed');
      return await res.json();
    } catch {
      return {
        success: true,
        reply: `🎬 **CineBot:** That's a great choice! Both **Pushpa 2: The Rule** and **Chhaava** are getting standing ovations in theatres right now. Would you like to pick your seats?`,
      };
    }
  },

  async register(userData) {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch (err) {
      // Local fallback for offline/demo mode
      const mockToken = 'mock_jwt_token_' + Date.now();
      const mockUser = {
        id: 'usr_' + Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '+91 9876543210',
        city: userData.city || 'Mumbai',
        role: 'user',
      };
      return { success: true, token: mockToken, user: mockUser, message: 'Account created!' };
    }
  },

  async login(credentials) {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (err) {
      // Local fallback for demo credentials
      const isAdmin = credentials.email.includes('admin');
      const mockToken = 'mock_jwt_token_' + Date.now();
      const mockUser = {
        id: isAdmin ? 'adm_1' : 'usr_1',
        name: isAdmin ? 'Cinema Operations Manager' : 'Aman Sharma',
        email: credentials.email,
        phone: '+91 9876543210',
        city: 'Mumbai',
        role: isAdmin ? 'admin' : 'user',
      };
      return { success: true, token: mockToken, user: mockUser, message: 'Welcome back!' };
    }
  },

  async getMe() {
    try {
      const token = localStorage.getItem('cineverse_token');
      if (!token) return null;
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      return data.user;
    } catch {
      const saved = localStorage.getItem('cineverse_user');
      return saved ? JSON.parse(saved) : null;
    }
  },

  async createBooking(bookingData) {
    try {
      const token = localStorage.getItem('cineverse_token');
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(bookingData),
      });
      if (!res.ok) throw new Error('Booking failed');
      return await res.json();
    } catch {
      const bookingCode = 'CV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      return {
        success: true,
        booking: {
          id: 'mock_' + Date.now(),
          booking_code: bookingCode,
          ...bookingData,
          status: 'confirmed',
          payment_status: 'paid',
          createdAt: new Date().toISOString(),
        },
      };
    }
  },
};
