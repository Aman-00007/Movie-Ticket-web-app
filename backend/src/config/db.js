const { Pool } = require('pg');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '4000', 10);
const user = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || 'Aman@2005';
const database = (process.env.DB_NAME || 'cineverse').toLowerCase();

// Full connection string
const dbUrl = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace(/\/CineVerse$/, '/cineverse')
  : `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;

// 1. Raw PostgreSQL Pool for direct SQL queries
const pool = new Pool({
  host,
  port,
  user,
  password,
  database,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// 2. Sequelize ORM instance
const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

/**
 * Executes a raw parameterized SQL query
 */
const query = (text, params) => pool.query(text, params);

/**
 * Initializes all database tables if they do not exist
 */
const initializeTables = async () => {
  const client = await pool.connect();
  try {
    console.log('🔄 Checking and initializing PostgreSQL tables in', database, '...');

    // Enable pgcrypto for gen_random_uuid()
    await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    // 1. Users Table (Secure with bcrypt password & JWT compatibility)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        city VARCHAR(100) DEFAULT 'Mumbai',
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        avatar_url TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2. Movies Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(200) NOT NULL,
        description TEXT,
        poster_url TEXT,
        backdrop_url TEXT,
        banner_url TEXT,
        trailer_url TEXT,
        duration_min INTEGER DEFAULT 120,
        rating DECIMAL(3, 1) DEFAULT 4.5,
        genre TEXT[] DEFAULT '{}',
        language TEXT[] DEFAULT '{}',
        release_date DATE,
        certification VARCHAR(10) DEFAULT 'UA',
        age_rating VARCHAR(10) DEFAULT 'U/A',
        status VARCHAR(20) DEFAULT 'now_showing' CHECK (status IN ('now_showing', 'upcoming', 'archived', 'ended')),
        "cast" JSONB DEFAULT '[]',
        director VARCHAR(100),
        votes INTEGER DEFAULT 1200,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      ALTER TABLE movies ADD COLUMN IF NOT EXISTS banner_url TEXT;
      ALTER TABLE movies ADD COLUMN IF NOT EXISTS age_rating VARCHAR(10) DEFAULT 'U/A';
      ALTER TABLE movies ADD COLUMN IF NOT EXISTS votes INTEGER DEFAULT 1200;
    `);

    // 3. Theatres Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS theatres (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100),
        pincode VARCHAR(20),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        amenities TEXT[] DEFAULT '{}',
        screens JSONB DEFAULT '[]',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 4. Shows Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS shows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
        theatre_id UUID REFERENCES theatres(id) ON DELETE CASCADE,
        show_date DATE NOT NULL,
        show_time TIME NOT NULL,
        format VARCHAR(20) DEFAULT '2D' CHECK (format IN ('2D', '3D', 'IMAX', '4DX')),
        language VARCHAR(50) DEFAULT 'Hindi',
        base_price DECIMAL(10, 2) NOT NULL DEFAULT 250,
        total_seats INTEGER DEFAULT 50,
        available_seats INTEGER DEFAULT 50,
        screen_number INTEGER DEFAULT 1,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 5. Seats Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS seats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        show_id UUID REFERENCES shows(id) ON DELETE CASCADE,
        row_label VARCHAR(5) NOT NULL,
        seat_number INTEGER NOT NULL,
        seat_type VARCHAR(20) DEFAULT 'normal' CHECK (seat_type IN ('normal', 'premium', 'vip', 'recliner')),
        price_multiplier DECIMAL(3, 2) DEFAULT 1.0,
        status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'held', 'blocked')),
        held_by UUID REFERENCES users(id) ON DELETE SET NULL,
        held_until TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(show_id, row_label, seat_number)
      );
    `);

    // 6. Beverages Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS beverages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(30) NOT NULL CHECK (category IN ('drinks', 'snacks', 'combos', 'desserts', 'popcorn')),
        image_url TEXT,
        calories INTEGER,
        is_vegetarian BOOLEAN DEFAULT true,
        is_available BOOLEAN DEFAULT true,
        is_bestseller BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 7. Bookings Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        booking_code VARCHAR(50) UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        show_id UUID REFERENCES shows(id) ON DELETE SET NULL,
        seats JSONB NOT NULL DEFAULT '[]',
        beverages JSONB DEFAULT '[]',
        ticket_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        beverage_price DECIMAL(10, 2) DEFAULT 0,
        convenience_fee DECIMAL(10, 2) DEFAULT 0,
        discount_code VARCHAR(50),
        discount_amount DECIMAL(10, 2) DEFAULT 0,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'expired')),
        payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
        stripe_payment_intent_id VARCHAR(255),
        qr_code_data TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('✅ All PostgreSQL tables verified/created in database:', database);
  } catch (err) {
    console.error('❌ Error initializing database tables:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  sequelize,
  Sequelize,
  query,
  initializeTables,
};
