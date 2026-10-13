# 🎬 CineVerse — Next-Gen Cinema Experience & 2026 Movie Ticket Booking Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20(MVC)-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20MVC-black?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Sequelize%20ORM-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini%203.1%20Flash-8E75C2?logo=google&logoColor=white)](https://ai.google.dev/)
[![Auth](https://img.shields.io/badge/Security-JWT%20%2B%20Bcrypt%20RBAC-green.svg)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**CineVerse** is a full-stack cinema ticket booking and movie discovery web application inspired by BookMyShow, AMC Theatres, and modern streaming platforms. Built with a responsive **React 18 + Vite** frontend (clean MVC architecture) and an **Express.js MVC** backend backed by **PostgreSQL** with Sequelize ORM and **Google Gemini 3.1 Flash AI**.

---

## ✨ Key Features & Innovations

### 🎬 1. Real-Time 2026 Blockbusters & Smart Advance Booking
- **Curated 2026 Lineup:** Includes latest blockbusters: *Avengers: Doomsday, Spider-Man 4, War 2, The Batman Part II, Avatar 3: Fire and Ash, Shrek 5, Dune: Messiah, Drishyam 3, TOXIC: A Fairy Tale for Grown-ups*.
- **Release-Date Aware Actions:**
  - **Now Showing:** Instant showtime selection, seating map, and checkout.
  - **Advance Booking:** Dynamically enabled for upcoming movies releasing in the near future.
  - **Future Releases:** Displays trailer preview and countdown to release date.
- **Dynamic Poster Showcase:** Fitted horizontal scrolling banner and recommended movies row with responsive aspect ratios.

---

### 🛡️ 2. Admin Movie Management & Gemini 3.1 Flash Sync
- **Role-Based Access Control (RBAC):** Verified with JWT tokens; only administrators can create, edit, or delete movies.
- **AI-Powered Discovery (`POST /api/movies/ai-search`):** Search any movie to automatically fetch release dates, synopses, trailer links, poster imagery, and cast via Google Gemini 3.1 Flash.
- **Full Database Sync:** Real-time updates for trailer embeds, poster URLs, and release status directly into PostgreSQL.

---

### 💺 3. Realistic Physical Cinema Seating Architecture
- **Realistic Tier Layout:**
  - 🖥️ **Curved Ultra-Wide Screen** at the front.
  - 🪑 **Classic Seats (₹250)**: Rows A – C (front tiers).
  - 🛋️ **Executive Seats (₹350)**: Rows D – F (middle prime audio zone).
  - ⭐ **Premium Recliner Lounge (₹450)**: Rows G – H (back luxury tier).
- **Seat Number Tracking:** Formatted seat numbers (e.g. `A14`, `B5`, `C16`, `H13`).
- **PostgreSQL Concurrency:** Real-time seat locking with transaction safety to prevent double bookings.

---

### 🔍 4. Dynamic Live Search with Instant Autocomplete Dropdown
- **Multi-Field Matching:** Searches in real-time across:
  - Movie Title (e.g., *Avengers*, *War 2*)
  - Cast & Actors (e.g., *Tom Holland*, *Hrithik Roshan*, *Robert Downey Jr.*)
  - Genres (*Action*, *Sci-Fi*, *Thriller*)
  - Languages (*English*, *Hindi*, *Tamil*, *Telugu*)
  - Directors & Synopses
- **Floating Autocomplete Card:** Features movie posters, certification tags, and keyboard navigation (`Esc` to dismiss).

---

### 👤 5. Sleek Circular Avatar & User Profile System
- **Uncluttered Modern Navbar:** Replaced plain text user display and direct logout button with a **40px circular user avatar icon** featuring user initials, glowing gradient border, and an online status indicator.
- **Glassmorphic Dropdown Menu:**
  - User name, email, and role badge (`🛡️ ADMINISTRATOR` / `⭐ VIP CINEPHILE`).
  - Mini live **Profile Completion Score bar** (`80% Complete`).
  - **Edit Profile & Preferences** (opens user settings).
  - **My Bookings & Passes** (with live ticket count badge).
  - **Manage 2026 Movies** (Admin only).
  - **Food & Concessions** shortcut.
  - **Sign Out** action with instant session cleanup.
  - Outside-click backdrop overlay for automatic dismissal.
- **Dedicated User Profile & Preferences Page (`UserProfilePageView`):**
  - **Live Profile Completion Score Meter:** Dynamic 0%–100% gradient progress bar with level badges (*Elite Cinephile 100%*, *Master Movie Buff 70%+*, *Active Enthusiast 40%+*).
  - **Live Checklist:** Real-time breakdown of completed and missing fields with point values (`+15% Genres`, `+10% Formats`, `+10% Bio`).
  - **Movie Preferences:** Interactive multi-select pill tags for **Favorite Genres**, **Preferred Formats** (*IMAX 3D, 4DX, Dolby Atmos, ScreenX*), and **Languages**.
  - **Cinema Bio & Personal Details:** Custom bio, all-time favorite movie, date of birth, preferred city, and preset cinema avatar selector.
  - Persisted to PostgreSQL `users` table via `PUT /api/auth/me`.

---

### 🎟️ 6. "My Bookings" Dashboard & Ticket Cancellation Policy
- **Full-Page Booking Dashboard (`MyBookingsPageView`):** Displays Active Passes and Past/Cancelled booking records.
- **Printable Visual QR Code Passes:** Complete with unique booking ID, theatre auditorium, seat numbers, showtime, and snack receipts.
- **Smart Cancellation Policy:**
  - Bookings can be cancelled within the cancellation window (e.g. booked within 5 days, cancellable up to 4 days before showtime).
  - Instant refund calculation and automatic seat status release back to "available" in PostgreSQL.

---

### 💳 7. Simulated UPI QR Code Gateway & Stripe Checkout
- **Instant UPI QR Code Generator:** Simulated UPI payment option for frictionless testing and verification with real-time countdown timer and QR code scan.
- **Stripe Ready:** Full Stripe `PaymentIntent` integration with webhook support for card payments.

---

### 🤖 8. CineBot AI Cinema Concierge (Google Gemini 3.1 Flash)
- **Mood Recommender:** Suggests films and gourmet snack pairings based on mood (*Thrilled, Heartfelt, Comedy, Mind-Bending*).
- **Conversational Cinema Assistant:** Answers cinema questions, cinema format queries (IMAX vs 4DX), and trivia.
- **Resilient Fallback Engine:** Features curated fallback responses if offline.

---

### 🎮 9. In-App Arcade Games & Discount Rewards
- **Popcorn Catch:** Catch falling golden popcorn (+1) while avoiding red chillies.
- **Dynamic Cinema Trivia:** Film quiz questions that shuffle and update dynamically.
- **Unlockable Coupons:** Scoring 10+ points unlocks discount vouchers (**`CINE20`** for 20% off, **`FIRST50`** for 50% off).

---

### 🍿 10. Gourmet Concessions & Seat Delivery
- Order gourmet popcorn (*Caramel Crunch, Classic Butter*), snacks (*Cheesy Jalapeño Nachos*), and beverages (*Cold Brew, Zero-Sugar Cola*) delivered directly to your cinema seat.

---

## 🏗️ System Architecture

```
Movie-Ticket-web-app/
├── backend/                              # Express.js (MVC Pattern)
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                     # PostgreSQL Sequelize Connection & DDL
│   │   │   └── database.js               # DB configuration
│   │   ├── controllers/
│   │   │   ├── authController.js         # JWT Auth, Register, Login, Profile Update
│   │   │   ├── movieController.js        # Movie CRUD, Gemini AI Search, Sync
│   │   │   ├── bookingController.js      # Booking Engine, Cancellation, My Bookings
│   │   │   ├── paymentController.js      # Stripe & UPI QR Simulation
│   │   │   ├── theatreController.js      # Theatres & Geolocation
│   │   │   ├── showController.js         # Showtimes & Seat Maps
│   │   │   └── aiController.js           # Gemini 3.1 Flash AI Concierge
│   │   ├── models/                       # Sequelize Models (User, Movie, Booking, etc.)
│   │   ├── routes/                       # Express Route Handlers
│   │   ├── middleware/                   # JWT Auth Protect & Role Validation
│   │   ├── services/                     # 2026 Movie Datasets & AI Services
│   │   ├── utils/                        # JWT Sign/Verify Helpers
│   │   ├── app.js                        # Express App Configuration
│   │   ├── server.js                     # Server Bootstrap (Port 5000)
│   │   └── seed.js                       # Database Seeding Script
│   ├── .env.example
│   └── package.json
│
├── frontend/                             # React 18 SPA (Vite + MVC)
│   ├── src/
│   │   ├── components/                   # Reusable UI Components
│   │   │   ├── Navbar.jsx                # Circular Avatar, Search & Dropdown
│   │   │   ├── HeroBanner.jsx            # Dynamic 2026 Carousel
│   │   │   ├── MovieCard.jsx             # Poster Card with Booking/Trailer Actions
│   │   │   ├── BookingModal.jsx          # Seat Map (Front Classic -> Back Recliner)
│   │   │   ├── MovieManagerModal.jsx     # Admin Movie CRUD & Gemini Search
│   │   │   ├── AiAssistantModal.jsx      # CineBot AI Concierge
│   │   │   ├── MiniGameModal.jsx         # Trivia Quiz & Popcorn Game
│   │   │   ├── SnacksModal.jsx           # Gourmet Food Ordering
│   │   │   ├── TicketsModal.jsx          # QR Code Cinema Pass
│   │   │   ├── TrailerModal.jsx          # YouTube Trailer Player
│   │   │   └── Footer.jsx                # Cinema Footer
│   │   ├── views/                        # Page-Level Views
│   │   │   ├── HomeView.jsx              # Main Movies Catalog & Sections
│   │   │   ├── MovieDetailPageView.jsx   # Dedicated Movie Detail & Showtimes View
│   │   │   ├── MyBookingsPageView.jsx    # Bookings Dashboard & Cancellation
│   │   │   ├── UserProfilePageView.jsx   # Profile Edit & 0-100% Completeness Meter
│   │   │   └── AuthModalView.jsx         # Login & Register Modal
│   │   ├── models/                       # Client Domain Models (UserModel, MovieModel, etc.)
│   │   ├── controllers/                  # Custom Controller Hooks (useMovie, useBooking, etc.)
│   │   ├── services/api.js               # Axios Client with Local Fallbacks
│   │   ├── index.css                     # Dark Glassmorphism Cinema Theme
│   │   ├── App.jsx                       # Master Routing & State
│   │   └── main.jsx                      # Entrypoint
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL 16+** (default port **`4000`** on this system)

---

### 🐘 1. Database Setup (pgAdmin / PostgreSQL)

1. Open **pgAdmin 4** or your PostgreSQL CLI.
2. Create a new database named **`cineverse`**:
   ```sql
   CREATE DATABASE cineverse;
   ```
3. Configure `backend/.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=4000
   DB_USER=postgres
   DB_PASSWORD=YOUR_PASSWORD
   DB_NAME=cineverse
   JWT_SECRET=cineverse_jwt_secret_key_2026
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```

---

### ⚙️ 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Seed movies, showtimes, seats, and concessions
npm run seed

# Start API server
npm run dev
```

> **API Base URL:** `http://localhost:5000`  
> **Health Check:** `http://localhost:5000/health`

---

### 💻 3. Frontend Setup

In a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

> **Frontend Web App:** `http://localhost:5173`

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/health` | Server health check | Public |
| **Auth** | | | |
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Login and receive JWT token | Public |
| `GET` | `/api/auth/me` | Get current logged-in user details | Protected |
| `PUT` | `/api/auth/me` | Update user profile, genres, and preferences | Protected |
| **Movies** | | | |
| `GET` | `/api/movies` | Get all movies with genre/language filters | Public |
| `GET` | `/api/movies/nowshowing` | Get currently showing movies | Public |
| `GET` | `/api/movies/upcoming` | Get upcoming 2026 movies | Public |
| `GET` | `/api/movies/search?q=` | Dynamic search query across movies | Public |
| `GET` | `/api/movies/:id` | Get movie details by ID | Public |
| `POST` | `/api/movies/ai-search` | Gemini AI search and fetch 2026 movie | Admin Only |
| `POST` | `/api/movies/sync-2026` | Seed and synchronize 2026 movies | Admin Only |
| `POST` | `/api/movies` | Add new movie to database | Admin Only |
| `PUT` | `/api/movies/:id` | Update movie details, trailer, or poster | Admin Only |
| `DELETE`| `/api/movies/:id` | Delete movie from database | Admin Only |
| **Shows & Theatres** | | | |
| `GET` | `/api/theatres` | Fetch theatres with city & distance filters | Public |
| `GET` | `/api/shows/:showId/seats` | Get seat map & availability for a show | Public |
| **Bookings & Payments** | | | |
| `POST` | `/api/bookings` | Reserve seats and create booking | Protected |
| `GET` | `/api/bookings/my` | Get all bookings for current user | Protected |
| `POST` | `/api/bookings/:id/cancel` | Cancel booking within cancellation window | Protected |
| `POST` | `/api/payments/create-intent` | Initialize payment (Stripe / UPI Simulation) | Protected |
| `POST` | `/api/payments/confirm` | Confirm payment & book seats | Protected |
| **Concessions & AI** | | | |
| `GET` | `/api/beverages` | Get food & drink catalog | Public |
| `POST` | `/api/ai/recommend` | Gemini AI movie recommendations | Public |
| `POST` | `/api/ai/chat` | CineBot AI interactive chat assistant | Public |

---

## 🧪 Demo Credentials

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **User** | `user@cineverse.com` | `password123` | Book tickets, view profile, manage bookings, rate films |
| **Admin** | `admin@cineverse.com` | `admin123` | Manage 2026 movies, Gemini AI movie search, update trailers/posters |

*You can also click the **1-Click Demo Login** button directly in the Sign In modal.*

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).