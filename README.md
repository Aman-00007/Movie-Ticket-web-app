# 🎬 CineVerse — Premium Cinema Experience & Movie Ticket Booking

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20MVC-black?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Sequelize-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini%203.1%20Flash-8E75C2?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**CineVerse** is a modern full-stack movie ticket booking web application inspired by BookMyShow and AMC Theatres. Built with a responsive **React 18 + Vite** frontend and an **Express.js MVC** backend backed by **PostgreSQL** with Sequelize ORM and **Google Gemini 3.1 Flash AI**.

---

## ✨ Key Features

### 🎟️ 1. Interactive Cinema Ticket Booking
- **Cinematic Hero Showcase:** Dynamic banner carousel featuring currently trending blockbusters (*Sitaare Zameen Par, F1, Kannappa, Housefull 5, M3GAN 2.0*).
- **Interactive Seat Map:** Visual seating map with curved screen glow, row letters (A-E), seat status tracking (Available, Selected, Booked), and tier breakdown (**Silver ₹250**, **Gold ₹350**, **Platinum Recliner ₹450**).
- **Real-time Price Engine:** Dynamic calculations for subtotal, convenience fee, GST, and promotional coupons.
- **Visual QR Ticket Pass:** Instant cinema entry pass with unique booking ID, screen details, seat codes, and print-ready format.

### 📍 2. BookMyShow-Style City & Location Detection
- Browse showtimes by city (**Mumbai, Delhi NCR, Bengaluru, Hyderabad, Pune**).
- GPS Auto-Detection with nearby theatre distance calculation (km).
- Screen format tags: **IMAX 3D with Laser**, **Dolby Atmos**, **Gold Class Recliners**, **4DX**.

### 🍿 3. Gourmet Snacks & Beverage Ordering
- Order popcorn, drinks, and meals delivered directly to your cinema seat.
- Catalog includes **Caramel Crunch Popcorn**, **Classic Butter Popcorn**, **Cheesy Jalapeño Nachos**, **Zero-Sugar Cola**, **Cold Brew**, and **Blockbuster Duo Combos**.
- Add/remove items with instant cart total updates.

### 🤖 4. CineBot AI Cinema Concierge (Google Gemini)
- **Mood Recommender:** Pick your mood (*Excited & Thrilled, Heartfelt, Laugh-out-loud Comedy, Sci-Fi*) and get tailored movie recommendations and snack pairings.
- **Live Conversational Chat:** Ask questions regarding showtimes, cinema formats, or movie trivia.
- **Resilient Fallback Engine:** Features curated recommendations even in offline/demo mode.

### 🎮 5. In-App Arcade Mini-Games (Win Real Discounts!)
- **Popcorn Catch:** Move your cinema bucket to catch falling golden popcorn (+1) while dodging fiery red chillies!
- **Movie Trivia Challenge:** Answer 4 fast-paced cinema questions to test your film knowledge.
- **Coupon Rewards:** Scoring 10+ points unlocks discount codes (**`CINE20`** for 20% off, **`FIRST50`** for 50% off)!

### 💳 6. Flexible Payment & Auth
- **Seamless Test Mode:** Simulated payments with instant confirmation for frictionless review and grading.
- **Stripe Ready:** Full Stripe PaymentIntent support with secure webhooks.
- **1-Click Demo Login:** Quick switch between user (*Aman Sharma*) and admin (*Cinema Manager*).

---

## 🏗️ System Architecture

```
CineVerse/
├── backend/                       # Express.js (MVC Pattern)
│   ├── src/
│   │   ├── config/database.js     # PostgreSQL Sequelize Connection
│   │   ├── controllers/           # Auth, Movie, Theatre, Show, Booking, Payment, AI
│   │   ├── models/                # User, Movie, Theatre, Show, Seat, Booking, Beverage
│   │   ├── routes/                # Express API Route Handlers
│   │   ├── middleware/            # JWT Auth Protect & Error Handlers
│   │   ├── services/              # Email Service & Seed Data
│   │   ├── utils/                 # JWT Helper (Sign/Verify)
│   │   ├── app.js                 # Express App Configuration
│   │   ├── server.js              # Server Bootstrap & DB Sync
│   │   └── seed.js                # Database Seeding Script
│   ├── .env.example
│   └── package.json
│
├── frontend/                      # React 18 SPA (Vite)
│   ├── src/
│   │   ├── components/            # Navbar, HeroBanner, MovieCard, BookingModal,
│   │   │                          # AiAssistantModal, MiniGameModal, SnacksModal,
│   │   │                          # TrailerModal, TicketsModal, AuthModal, Footer
│   │   ├── services/api.js        # API Client with Resilient Fallback Data
│   │   ├── index.css              # Custom Dark Cinema Glassmorphism Design System
│   │   ├── App.jsx                # Core App Component & State Management
│   │   └── main.jsx               # React DOM Entry
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── ARCHITECTURE.md                # Full Architecture Specification
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL 18** (or any PostgreSQL instance)

---

### 🐘 1. Database Setup with pgAdmin

PostgreSQL runs locally (default port **`4000`** on this system):

1. Open **pgAdmin 4**.
2. Connect to your PostgreSQL server using your master password.
3. In the left panel, right-click **Databases** ➔ **Create** ➔ **Database...**
4. Enter the database name: **`cineverse`** and click **Save**.
5. Configure `backend/.env` with your password:
   ```env
   DB_HOST=localhost
   DB_PORT=4000
   DB_USER=postgres
   DB_PASSWORD=YOUR_PGADMIN_PASSWORD
   DB_NAME=cineverse
   ```

---

### ⚙️ 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Seed movies, theatres, showtimes, seats, and snacks into PostgreSQL
npm run seed

# Start development server
npm run dev
```

> **Backend API URL:** `http://localhost:5000`  
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
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Login and receive JWT token | Public |
| `GET` | `/api/movies` | Fetch all movies with genre/language filters | Public |
| `GET` | `/api/theatres` | Fetch theatres with city & geolocation filter | Public |
| `GET` | `/api/shows/:showId/seats` | Get seat map & availability for a show | Public |
| `POST` | `/api/bookings` | Hold seats and create booking | Protected |
| `POST` | `/api/payments/create-intent` | Initialize payment (Stripe / Test) | Protected |
| `POST` | `/api/payments/confirm` | Confirm payment & book seats | Protected |
| `GET` | `/api/beverages` | Get food & drink catalog | Public |
| `POST` | `/api/ai/recommend` | Gemini AI movie recommendations | Public |
| `POST` | `/api/ai/chat` | CineBot AI chat assistant | Public |

---

## 🧪 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **User** | `user@cineverse.com` | `password123` |
| **Admin** | `admin@cineverse.com` | `admin123` |

*Or click the **1-Click Demo Login** button directly in the Sign In modal.*

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).