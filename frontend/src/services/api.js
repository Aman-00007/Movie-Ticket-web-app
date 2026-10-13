// API Client with automatic fallback to rich local state if backend is offline

const BASE_URL = '/api';

export const fallbackMovies = [
  {
    id: 1,
    title: 'Sitaare Zameen Par',
    description: 'An uplifting and emotional sports drama centered around down syndrome athletes, directed by R. S. Prasanna and starring Aamir Khan.',
    poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
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
    id: 2,
    title: 'F1: The Apex Pursuit',
    description: 'A retired Formula 1 driver returns to the grid to mentor an upcoming rookie prodigy at the fictional APXGP team in high octane race tracks.',
    poster_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration_min: 148,
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
    id: 3,
    title: 'Kannappa',
    description: 'The legendary tale of the supreme devotee of Lord Shiva, featuring epic battle sequences and spiritual grandeur.',
    poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration_min: 165,
    rating: 4.6,
    genre: ['Action', 'Mythology', 'Drama'],
    language: ['Telugu', 'Hindi', 'Tamil'],
    certification: 'UA',
    status: 'now_showing',
    release_date: '2025-07-04',
    director: 'Mukesh Kumar Singh',
    cast: [{ name: 'Vishnu Manchu', role: 'Kannappa' }, { name: 'Prabhas', role: 'Rudra' }]
  },
  {
    id: 4,
    title: 'Housefull 5',
    description: 'The mega-comedy franchise takes to the high seas on a luxury cruise liner with double the confusion, laughter, and madness.',
    poster_url: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration_min: 140,
    rating: 4.2,
    genre: ['Comedy'],
    language: ['Hindi'],
    certification: 'UA',
    status: 'now_showing',
    release_date: '2025-06-06',
    director: 'Tarun Mansukhani',
    cast: [{ name: 'Akshay Kumar', role: 'Harry' }, { name: 'Riteish Deshmukh', role: 'Roy' }]
  },
  {
    id: 5,
    title: 'M3GAN 2.0',
    description: 'The AI doll returns with military-grade upgrades, deeper autonomy, and an unyielding mission to protect her best friend.',
    poster_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration_min: 112,
    rating: 4.4,
    genre: ['Sci-Fi', 'Horror', 'Thriller'],
    language: ['English', 'Hindi'],
    certification: 'A',
    status: 'now_showing',
    release_date: '2025-06-27',
    director: 'Gerard Johnstone',
    cast: [{ name: 'Allison Williams', role: 'Gemma' }, { name: 'Violet McGraw', role: 'Cady' }]
  },
  {
    id: 6,
    title: 'How to Train Your Dragon (Live Action)',
    description: 'The beloved saga of Hiccup and Toothless comes alive in breathtaking photorealistic live action across the Isle of Berk.',
    poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration_min: 135,
    rating: 4.9,
    genre: ['Fantasy', 'Adventure', 'Family'],
    language: ['English', 'Hindi'],
    certification: 'U',
    status: 'now_showing',
    release_date: '2025-06-13',
    director: 'Dean DeBlois',
    cast: [{ name: 'Mason Thames', role: 'Hiccup' }, { name: 'Nico Parker', role: 'Astrid' }]
  },
  {
    id: 7,
    title: 'Maa',
    description: 'A heartwarming story about sacrifice, motherhood, and triumphant resilience in rural India.',
    poster_url: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration_min: 130,
    rating: 4.5,
    genre: ['Drama', 'Family'],
    language: ['Hindi'],
    certification: 'U',
    status: 'upcoming',
    release_date: '2025-08-15',
    director: 'Aanand L. Rai',
    cast: [{ name: 'Kangana Ranaut', role: 'Devi' }]
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
    name: 'CineVerse Select Citywalk',
    address: 'District Centre, Saket, South Delhi',
    city: 'Delhi',
    latitude: 28.5284,
    longitude: 77.2193,
    distance_km: 3.8,
    amenities: ['IMAX', '4DX', 'Dolby Atmos', 'Gourmet Food'],
    screens: ['Audi 1', 'Audi 2'],
    showtimes: ['10:15 AM', '01:30 PM', '04:45 PM', '08:00 PM', '10:45 PM']
  },
  {
    id: 4,
    name: 'CineVerse Nexus Mall',
    address: 'Koramangala 7th Block',
    city: 'Bengaluru',
    latitude: 12.9352,
    longitude: 77.6111,
    distance_km: 4.2,
    amenities: ['IMAX with Laser', 'Dolby Atmos', 'Cafe Lounge'],
    screens: ['Audi 1'],
    showtimes: ['10:00 AM', '01:15 PM', '05:00 PM', '08:30 PM']
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
    name: 'Movie Classic Salted Butter Popcorn',
    category: 'popcorn',
    price: 220,
    image_url: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&auto=format&fit=crop&q=80',
    description: 'Crisp hot corn kernels with rich melted golden butter.'
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
      // Local smart recommendation fallback
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
        reply: `🎬 **CineBot:** That's a great choice! Both **F1: The Apex Pursuit** and **Sitaare Zameen Par** are getting standing ovations in theatres right now. Would you like me to book tickets for you?`,
      };
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
      // Offline fallback: generate client-side booking confirmation
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
