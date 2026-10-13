// API Client with automatic fallback to rich local state if backend is offline

const BASE_URL = '/api';

export const fallbackMovies = [
  {
    id: 'drishyam-the-conclusion',
    title: 'Drishyam The Conclusion',
    description: 'Seven years after Georgekutty and Vijay Salgaonkar faced the law, a sensational new discovery reopens the missing body investigation, leading to the ultimate battle of wits and family sacrifice.',
    poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/9g3eP_F6Qv8',
    duration_min: 165,
    rating: 8.8,
    votes: 108420,
    genre: ['Drama', 'Mystery', 'Thriller'],
    language: ['Hindi', 'Malayalam', 'Telugu', 'Tamil'],
    certification: 'UA',
    status: 'now_showing',
    release_date: '2026-08-02',
    director: 'Abhishek Pathak',
    cast: [
      { name: 'Ajay Devgn', role: 'Vijay Salgaonkar' },
      { name: 'Tabu', role: 'Meera Deshmukh' },
      { name: 'Akshaye Khanna', role: 'IG Tarun Ahlawat' },
      { name: 'Shriya Saran', role: 'Nandini Salgaonkar' }
    ]
  },
  {
    id: 'doraemon-undersea',
    title: 'Doraemon: Castle of the Undersea Devil',
    description: 'Nobita and his friends embark on an epic camping expedition beneath the Atlantic Ocean, uncovering an ancient underwater civilization in danger of global annihilation.',
    poster_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/n4p_yO1x_eI',
    duration_min: 110,
    rating: 9.1,
    votes: 15400,
    genre: ['Adventure', 'Animation', 'Comedy', 'Family', 'Fantasy'],
    language: ['Hindi', 'Japanese', 'English'],
    certification: 'U',
    status: 'now_showing',
    release_date: '2026-06-15',
    director: 'Tsutomu Shibayama',
    cast: [
      { name: 'Wasabi Mizuta', role: 'Doraemon' },
      { name: 'Megumi Ohara', role: 'Nobita Nobi' },
      { name: 'Yumi Kakazu', role: 'Shizuka Minamoto' }
    ]
  },
  {
    id: 'hanuman-ansh',
    title: 'Hanuman Ansh',
    description: 'A contemporary mythological chronicle following an unassuming young seeker in rural India who awakens the primordial, unbreakable divine lineage of Lord Hanuman to safeguard righteousness against a looming shadow.',
    poster_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/92U6Y9JbB2Y',
    duration_min: 158,
    rating: 9.6,
    votes: 290150,
    genre: ['Biography', 'Devotional', 'Drama', 'Mythology'],
    language: ['Hindi', 'Telugu', 'Tamil', 'Kannada'],
    certification: 'U',
    status: 'now_showing',
    release_date: '2026-05-18',
    director: 'Prasanth Varma',
    cast: [
      { name: 'Teja Sajja', role: 'Hanumanth / Ansh' },
      { name: 'Amritha Aiyer', role: 'Meenakshi' },
      { name: 'Varalaxmi Sarathkumar', role: 'Anjamma' }
    ]
  },
  {
    id: 'the-vvaan',
    title: 'The Vvaan - Force of the Forrest',
    description: 'An ancient guardian tribe entrenched deep in the forbidden Himalayan rainforest confronts ruthless industrial mercenaries trying to awaken a dormant dark bio-force.',
    poster_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/Way9Dexny3w',
    duration_min: 152,
    rating: 8.5,
    votes: 43700,
    genre: ['Action', 'Adventure', 'Fantasy', 'Mystery', 'Thriller'],
    language: ['Hindi', 'Tamil', 'Telugu'],
    certification: 'UA',
    status: 'now_showing',
    release_date: '2026-07-10',
    director: 'Deepak Shivdasani',
    cast: [
      { name: 'Sidharth Malhotra', role: 'Rudra / Vvaan' },
      { name: 'Sara Ali Khan', role: 'Dr. Ira Sharma' },
      { name: 'Pankaj Tripathi', role: 'Elder Guruji' }
    ]
  },
  {
    id: 'other-mommy',
    title: 'Other Mommy',
    description: 'When a nine-year-old child begins communicating with an uncanny entity behind her bedroom vanity mirror claiming to be her true mother, horrifying supernatural secrets consume the household.',
    poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/5FkXbL_j_c8',
    duration_min: 104,
    rating: 6.4,
    votes: 1920,
    genre: ['Horror', 'Thriller', 'Mystery'],
    language: ['English', 'Hindi'],
    certification: 'A',
    status: 'now_showing',
    release_date: '2026-09-04',
    director: 'David F. Sandberg',
    cast: [
      { name: 'Rebecca Ferguson', role: 'Clara / The Entity' },
      { name: 'Woody Norman', role: 'Leo' },
      { name: 'Patrick Wilson', role: 'Detective Miller' }
    ]
  },
  {
    id: 'spider-man-brand-new-day',
    title: 'Spider-Man: Brand New Day',
    description: 'Peter Parker navigates college and adulthood in New York City with no one remembering his identity, until a lethal underworld conspiracy challenges the web-slinger to forge a brand new heroic legacy.',
    poster_url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/shW9i6k8cB0',
    duration_min: 146,
    rating: 9.2,
    votes: 82000,
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    language: ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'],
    certification: 'UA',
    status: 'upcoming',
    release_date: '2026-07-24',
    director: 'Destin Daniel Cretton',
    cast: [
      { name: 'Tom Holland', role: 'Peter Parker / Spider-Man' },
      { name: 'Zendaya', role: 'MJ' },
      { name: 'Mark Ruffalo', role: 'Bruce Banner / Hulk' }
    ]
  },
  {
    id: 'insidious-out-of-the-further',
    title: 'Insidious: Out of The Further',
    description: 'The Lambert bloodline faces the deepest, most terrifying stratum of The Further, where demonic entities construct an inescapable psychic labyrinth.',
    poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/m_KkYt2Vj8s',
    duration_min: 112,
    rating: 8.2,
    votes: 31200,
    genre: ['Horror', 'Mystery', 'Thriller'],
    language: ['English', 'Hindi', 'Tamil', 'Telugu'],
    certification: 'A',
    status: 'upcoming',
    release_date: '2026-08-28',
    director: 'Patrick Wilson',
    cast: [
      { name: 'Patrick Wilson', role: 'Josh Lambert' },
      { name: 'Ty Simpkins', role: 'Dalton Lambert' },
      { name: 'Rose Byrne', role: 'Renai Lambert' }
    ]
  },
  {
    id: 'the-last-meal',
    title: 'The Last Meal',
    description: 'An acclaimed veteran chef serving high-profile dignitaries in an isolated heritage haveli discovers that dinner tonight will decide the fate of a covert political coup.',
    poster_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/6_d0zV5HjD4',
    duration_min: 125,
    rating: 7.9,
    votes: 8900,
    genre: ['Drama', 'Thriller', 'Crime'],
    language: ['Hindi'],
    certification: 'UA',
    status: 'upcoming',
    release_date: '2026-09-18',
    director: 'Hansal Mehta',
    cast: [
      { name: 'Manoj Bajpayee', role: 'Chef Devrat Sen' },
      { name: 'Jaideep Ahlawat', role: 'Minister Rao' },
      { name: 'Tillotama Shome', role: 'Investigator Suman' }
    ]
  },
  {
    id: 'the-social-reckoning',
    title: 'The Social Reckoning',
    description: 'The gripping biographical exposé of tech founders, whistleblowers, and senate investigations that cracked open the algorithms ruling global democracy.',
    poster_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/4rgYUipGJNo',
    duration_min: 142,
    rating: 9.3,
    votes: 1340,
    genre: ['Biography', 'Drama', 'Thriller'],
    language: ['English', 'Hindi'],
    certification: 'UA',
    status: 'now_showing',
    release_date: '2026-06-26',
    director: 'David Fincher',
    cast: [
      { name: 'Jesse Eisenberg', role: 'David Vance' },
      { name: 'Rooney Mara', role: 'Erica Albright' },
      { name: 'Andrew Garfield', role: 'Eduardo Saverin' }
    ]
  },
  {
    id: 'the-paradise',
    title: 'The Paradise',
    description: 'Set in the gritty 1980s borderlands, a charismatic renegade leads a rebellion against ruthless warlords controlling gold mines and trade routes.',
    poster_url: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/g3JUbgZXflM',
    duration_min: 168,
    rating: 9.4,
    votes: 506200,
    genre: ['Action', 'Adventure', 'Drama'],
    language: ['Telugu', 'Hindi', 'Tamil', 'Malayalam'],
    certification: 'A',
    status: 'upcoming',
    release_date: '2026-11-06',
    director: 'Srikanth Odela',
    cast: [
      { name: 'Nani', role: 'Bhairava' },
      { name: 'Keerthy Suresh', role: 'Mallamma' },
      { name: 'Shine Tom Chacko', role: 'Chinababu' }
    ]
  },
  {
    id: 'rajini-jailer-2',
    title: 'Rajini: The Jailer 2',
    description: 'Tiger Muthuvel Pandian returns from retirement when a global weapons cartel threatens law enforcement across southern India, unleashing pure cinematic mass euphoria.',
    poster_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/xenOE1Tma0A',
    duration_min: 172,
    rating: 9.5,
    votes: 157300,
    genre: ['Action', 'Thriller'],
    language: ['Tamil', 'Hindi', 'Telugu', 'Kannada'],
    certification: 'UA',
    status: 'upcoming',
    release_date: '2026-10-15',
    director: 'Nelson Dilipkumar',
    cast: [
      { name: 'Rajinikanth', role: 'Tiger Muthuvel Pandian' },
      { name: 'Mohanlal', role: 'Mathew' },
      { name: 'Shiva Rajkumar', role: 'Narasimha' },
      { name: 'Ramya Krishnan', role: 'Vijaya' }
    ]
  },
  {
    id: 'haiwaan',
    title: 'Haiwaan',
    description: 'In the underbelly of Mumbai and Bangkok, an uncompromising intelligence operative engages in a cat-and-mouse hunt against a ruthless psychopathic arms broker.',
    poster_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/1kVK0mP_32Y',
    duration_min: 148,
    rating: 5.8,
    votes: 4720,
    genre: ['Action', 'Crime', 'Thriller'],
    language: ['Hindi'],
    certification: 'A',
    status: 'now_showing',
    release_date: '2026-06-12',
    director: 'Ali Abbas Zafar',
    cast: [
      { name: 'Akshay Kumar', role: 'Agent Vikram' },
      { name: 'Saif Ali Khan', role: 'Rana Haiwaan' },
      { name: 'Rakul Preet Singh', role: 'Aditi' }
    ]
  },
  {
    id: 'war-2',
    title: 'War 2',
    description: 'Major Kabir Dhaliwal confronts a rogue intelligence asset of immense lethality in a high-octane global manhunt across Italy, Tokyo, and Ladakh.',
    poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/g3JUbgZXflM',
    duration_min: 160,
    rating: 9.5,
    votes: 215000,
    genre: ['Action', 'Thriller', 'Spy'],
    language: ['Hindi', 'Telugu', 'Tamil'],
    certification: 'UA',
    status: 'now_showing',
    release_date: '2026-08-14',
    director: 'Ayan Mukerji',
    cast: [
      { name: 'Hrithik Roshan', role: 'Major Kabir Dhaliwal' },
      { name: 'Jr. NTR', role: 'Agent Vikram / Shadow' },
      { name: 'Kiara Advani', role: 'Dr. Tanya' }
    ]
  },
  {
    id: 'toxic',
    title: 'Toxic: A Fairy Tale for Grown-ups',
    description: 'Set across the neon-drenched drug cartels and ports of 1970s London and Goa, a charismatic kingpin plays an uncompromising game of betrayal and empire.',
    poster_url: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/kQDd1AhGIHk',
    duration_min: 170,
    rating: 9.6,
    votes: 380000,
    genre: ['Action', 'Crime', 'Drama'],
    language: ['Kannada', 'Hindi', 'Telugu', 'Tamil', 'English'],
    certification: 'A',
    status: 'upcoming',
    release_date: '2026-04-10',
    director: 'Geetu Mohandas',
    cast: [
      { name: 'Yash', role: 'Raya' },
      { name: 'Nayanthara', role: 'Maya' },
      { name: 'Kiara Advani', role: 'Sasha' }
    ]
  },
  {
    id: 'ramayana-part-1',
    title: 'Ramayana: Part 1',
    description: 'Nitesh Tiwari’s monumental epic of the Ramayana chronicling Lord Rama’s exile, celestial battles, and divine steadfastness with world-class VFX by DNEG.',
    poster_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/hJ5f_F53aQY',
    duration_min: 185,
    rating: 9.8,
    votes: 495000,
    genre: ['Mythology', 'Action', 'Drama'],
    language: ['Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam'],
    certification: 'U',
    status: 'upcoming',
    release_date: '2026-10-30',
    director: 'Nitesh Tiwari',
    cast: [
      { name: 'Ranbir Kapoor', role: 'Lord Rama' },
      { name: 'Sai Pallavi', role: 'Mata Sita' },
      { name: 'Yash', role: 'Lankesh Ravana' },
      { name: 'Sunny Deol', role: 'Lord Hanuman' }
    ]
  },
  {
    id: 'avengers-doomsday',
    title: 'Avengers: Doomsday',
    description: 'The multiverse collides as the newly formed Avengers encounter the multiverse mastermind Victor Von Doom, sparking a cosmic war for existence.',
    poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/1pHDWnXmKMY',
    duration_min: 175,
    rating: 9.7,
    votes: 610000,
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    language: ['English', 'Hindi', 'Tamil', 'Telugu'],
    certification: 'UA',
    status: 'upcoming',
    release_date: '2026-12-18',
    director: 'Anthony and Joe Russo',
    cast: [
      { name: 'Robert Downey Jr.', role: 'Victor Von Doom / Doctor Doom' },
      { name: 'Pedro Pascal', role: 'Reed Richards / Mr. Fantastic' },
      { name: 'Benedict Cumberbatch', role: 'Doctor Strange' },
      { name: 'Anthony Mackie', role: 'Captain America' }
    ]
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
    distance_km: 3.2,
    amenities: ['PCX Giant Screen', 'Dolby Atmos', 'Food Court'],
    screens: ['Giant Screen Audi 1'],
    showtimes: ['10:45 AM', '02:00 PM', '05:45 PM', '09:15 PM']
  },
  {
    id: 6,
    name: 'CineVerse Phoenix Marketcity',
    address: 'Viman Nagar, Nagar Road',
    city: 'Pune',
    latitude: 18.5622,
    longitude: 73.9167,
    distance_km: 6.0,
    amenities: ['4DX', 'IMAX Laser', 'Gourmet Lounge'],
    screens: ['Audi 1'],
    showtimes: ['11:15 AM', '02:45 PM', '06:15 PM', '09:45 PM']
  }
];

export const fallbackBeverages = [
  {
    id: 1,
    name: 'Caramel Crunch Popcorn (Large)',
    category: 'popcorn',
    price: 260,
    image_url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&auto=format&fit=crop&q=80',
    description: 'Fresh warm popcorn glazed in rich golden butter caramel.'
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
    description: 'Crisp tortilla chips served with warm melted cheese dip and spicy salsa.'
  },
  {
    id: 4,
    name: 'Chilled Coca-Cola (Zero Sugar, 500ml)',
    category: 'drinks',
    price: 120,
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80',
    description: 'Ice-cold bubbly refreshment with zero calories.'
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

const getAuthHeaders = () => {
  const token = localStorage.getItem('cineverse_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // ─── Movies API ───
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

  async createMovie(movieData) {
    const res = await fetch(`${BASE_URL}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(movieData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create movie');
    return data;
  },

  async updateMovie(id, movieData) {
    const res = await fetch(`${BASE_URL}/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(movieData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update movie');
    return data;
  },

  async deleteMovie(id) {
    const res = await fetch(`${BASE_URL}/movies/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete movie');
    return data;
  },

  async aiSearchMovie(query, autoSave = true) {
    const res = await fetch(`${BASE_URL}/movies/ai-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ query, autoSave }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gemini Flash AI search failed');
    return data;
  },

  async sync2026Movies() {
    const res = await fetch(`${BASE_URL}/movies/sync-2026`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to sync 2026 movies');
    return data;
  },

  // ─── Theatres API ───
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

  // ─── Beverages API ───
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

  // ─── AI Concierge API ───
  async getAiRecommendation(payload) {
    try {
      const res = await fetch(`${BASE_URL}/ai/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
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
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ message, history }),
      });
      if (!res.ok) throw new Error('Chat failed');
      return await res.json();
    } catch {
      return {
        success: true,
        reply: "🎬 **CineBot:** Check out our 2026 releases like Drishyam The Conclusion, War 2, and Spider-Man: Brand New Day! What genre are you in the mood for?",
      };
    }
  },

  // ─── Auth API (PostgreSQL + JWT) ───
  async register(userData) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(credentials) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
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
    const token = localStorage.getItem('cineverse_token');
    if (!token) {
      throw new Error('Authentication required. Please log in to complete your booking.');
    }
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Booking failed');
    return data;
  },

  async createPaymentIntent(bookingId) {
    try {
      const token = localStorage.getItem('cineverse_token');
      const res = await fetch(`${BASE_URL}/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ booking_id: bookingId }),
      });
      if (!res.ok) throw new Error('Payment intent failed');
      return await res.json();
    } catch {
      return {
        success: true,
        client_secret: `mock_secret_${Date.now()}`,
        is_mock: true,
      };
    }
  },

  async confirmPayment(bookingId, paymentIntentId) {
    try {
      const token = localStorage.getItem('cineverse_token');
      const res = await fetch(`${BASE_URL}/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ booking_id: bookingId, payment_intent_id: paymentIntentId }),
      });
      if (!res.ok) throw new Error('Payment confirmation failed');
      return await res.json();
    } catch {
      return {
        success: true,
        message: '🎉 Booking confirmed via CineVerse Instant Gateway!',
      };
    }
  },

  async getMyBookings() {
    try {
      const token = localStorage.getItem('cineverse_token');
      if (!token) return [];
      const res = await fetch(`${BASE_URL}/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load bookings');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async cancelBooking(bookingId) {
    const token = localStorage.getItem('cineverse_token');
    if (!token) throw new Error('Authentication required');
    const res = await fetch(`${BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to cancel booking');
    return data;
  },
};

// ─── Configurable QR Code Generator API for Fake / Demo UPI Payments ───
// You can replace QR_API_BASE with your custom API (e.g. 'https://api.yourdomain.com/create-qr?data=')
export const QR_API_BASE = 'https://api.qrserver.com/v1/create-qr-code/';

export const getPaymentQrCodeUrl = (amount = 0, bookingCode = 'DEMO', payee = 'cineverse.pay@icici') => {
  const upiPayload = `upi://pay?pa=${payee}&pn=CineVerse%20Cinemas&am=${amount}&cu=INR&tn=CineVerse-Pass-${bookingCode}`;
  return `${QR_API_BASE}?size=240x240&data=${encodeURIComponent(upiPayload)}&margin=8`;
};

