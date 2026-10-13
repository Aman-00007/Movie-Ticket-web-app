# 🎬 CineVerse — Full-Stack Movie Ticket Booking Platform
> Complete System Architecture & Developer Guide

---

## 📁 Project Structure

```
CineVerse/
├── frontend/                          # React.js Application (Vite)
│   ├── public/assets/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── HeroBanner/
│   │   │   ├── MovieCard/
│   │   │   ├── SeatSelector/
│   │   │   ├── BeverageShop/
│   │   │   ├── AIAssistant/           # AI chat widget (Gemini)
│   │   │   ├── MiniGame/              # Trivia, Memory, Spin-to-Win
│   │   │   ├── NotificationPopup/
│   │   │   ├── PaymentForm/           # Stripe Elements
│   │   │   └── LocationPicker/        # Nearby theatres map
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Movies/
│   │   │   ├── MovieDetail/
│   │   │   ├── Booking/
│   │   │   ├── Checkout/
│   │   │   ├── Confirmation/
│   │   │   ├── Profile/
│   │   │   └── Auth/
│   │   ├── store/                     # Redux Toolkit
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── movieSlice.js
│   │   │   │   ├── bookingSlice.js
│   │   │   │   └── uiSlice.js
│   │   │   └── store.js
│   │   ├── services/                  # Axios API service layer
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── movieService.js
│   │   │   ├── bookingService.js
│   │   │   ├── paymentService.js
│   │   │   └── aiService.js
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── vite.config.js
│   └── package.json
│
├── backend/                           # Node.js + Express (MVC)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js            # PostgreSQL via Sequelize
│   │   │   ├── stripe.js
│   │   │   └── gemini.js
│   │   ├── models/                    # M — Model layer
│   │   │   ├── User.js
│   │   │   ├── Movie.js
│   │   │   ├── Theatre.js
│   │   │   ├── Show.js
│   │   │   ├── Seat.js
│   │   │   ├── Booking.js
│   │   │   ├── Beverage.js
│   │   │   └── index.js
│   │   ├── controllers/               # C — Controller layer
│   │   │   ├── authController.js
│   │   │   ├── movieController.js
│   │   │   ├── theatreController.js
│   │   │   ├── showController.js
│   │   │   ├── bookingController.js
│   │   │   ├── paymentController.js
│   │   │   ├── beverageController.js
│   │   │   └── aiController.js
│   │   ├── routes/                    # V — View/Route layer (REST)
│   │   │   ├── auth.routes.js
│   │   │   ├── movie.routes.js
│   │   │   ├── theatre.routes.js
│   │   │   ├── show.routes.js
│   │   │   ├── booking.routes.js
│   │   │   ├── payment.routes.js
│   │   │   ├── beverage.routes.js
│   │   │   └── ai.routes.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js     # JWT verification
│   │   │   ├── validate.middleware.js # Joi validation
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── services/
│   │   │   ├── emailService.js
│   │   │   ├── stripeService.js
│   │   │   └── geminiService.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── helpers.js
│   │   └── app.js
│   ├── migrations/
│   ├── seeders/
│   ├── .env
│   └── package.json
│
├── ARCHITECTURE.md                   ← You are here
└── README.md
```

---

## 🗄️ Database Schema (PostgreSQL)

```
users            movies           theatres
─────────        ──────────       ─────────
id (PK)          id (PK)          id (PK)
name             title            name
email            description      address
password_hash    genre            city
phone            language         latitude
avatar_url       rating           longitude
city             duration_min     amenities_json
created_at       release_date     created_at
                 poster_url
                 trailer_url      shows
                 cast_json        ─────────
                 created_at       id (PK)
                                  movie_id (FK)
seats                             theatre_id (FK)
─────────                         show_time
id (PK)                           show_date
theatre_id (FK)                   format (2D/3D/IMAX)
row_label                         base_price
seat_number                       available_seats
seat_type                         created_at
(normal/premium/vip)

bookings         beverages
─────────        ──────────
id (PK)          id (PK)
user_id (FK)     name
show_id (FK)     description
booking_code     price
seats_json       category
beverages_json   image_url
total_amount     is_available
payment_status
stripe_pi_id
status
created_at
```

---

## 🔌 REST API Endpoints

### Auth — `/api/auth`
| Method | Path       | What it does             | JWT? |
|--------|-----------|--------------------------|------|
| POST   | /register  | Create new account        | ❌   |
| POST   | /login     | Login → returns token     | ❌   |
| GET    | /me        | Get my profile            | ✅   |
| PUT    | /me        | Update profile            | ✅   |

### Movies — `/api/movies`
| Method | Path            | What it does              | JWT? |
|--------|----------------|---------------------------|------|
| GET    | /               | All movies with pagination | ❌   |
| GET    | /nowshowing     | Currently playing         | ❌   |
| GET    | /upcoming       | Coming soon               | ❌   |
| GET    | /search?q=      | Full-text search          | ❌   |
| GET    | /:id            | Movie detail + showtimes  | ❌   |

### Shows — `/api/shows`
| Method | Path                      | What it does              | JWT? |
|--------|--------------------------|---------------------------|------|
| GET    | /:showId/seats            | Seat availability map     | ❌   |
| GET    | /nearby?lat=&lng=&radius= | Shows near user location  | ❌   |

### Bookings — `/api/bookings`
| Method | Path  | What it does              | JWT? |
|--------|------|---------------------------|------|
| POST   | /     | Hold seats & create booking | ✅  |
| GET    | /my   | My booking history         | ✅  |
| GET    | /:id  | Single booking detail      | ✅  |
| DELETE | /:id  | Cancel booking             | ✅  |

### Payments — `/api/payments`
| Method | Path            | What it does                  | JWT?     |
|--------|----------------|-------------------------------|----------|
| POST   | /create-intent  | Create Stripe PaymentIntent   | ✅       |
| POST   | /confirm        | Confirm payment & book        | ✅       |
| POST   | /webhook        | Stripe async events handler   | ❌(Stripe)|

### Beverages — `/api/beverages`
| Method | Path        | What it does          | JWT? |
|--------|------------|-----------------------|------|
| GET    | /           | All beverages          | ❌   |
| GET    | /categories | Beverage categories   | ❌   |

### AI — `/api/ai`
| Method | Path        | What it does                    | JWT? |
|--------|------------|--------------------------------|------|
| POST   | /recommend  | AI movie recommendation        | ✅   |
| POST   | /chat       | Free-form AI chat              | ✅   |

---

## 🔄 Data Flow

```
Browser (React)
    │
    │  User clicks "Book Now"
    ▼
Redux Action dispatched
    │
    ▼
Axios service call → POST /api/bookings
    │
    ▼
Express Router → auth middleware → bookingController
    │
    ▼
Sequelize ORM → PostgreSQL
    │
    ▼
Response JSON ← back through the chain
    │
    ▼
Redux store updated (bookingSlice)
    │
    ▼
React re-renders Booking Confirmation UI
```

---

## 💳 Stripe Payment Flow

```
1. User selects seats + beverages
2. Clicks "Proceed to Pay"
3. Frontend: POST /api/payments/create-intent  → { client_secret }
4. Stripe Elements renders payment form
5. User enters card details (test: 4242 4242 4242 4242)
6. Stripe SDK confirms payment client-side
7. Frontend: POST /api/payments/confirm → booking finalized
8. Stripe Webhook fires → backend updates DB
9. Email confirmation sent via Nodemailer
```

---

## 🤖 AI Assistant Flow (Gemini)

```
1. User types "recommend a thriller for date night"
2. Frontend: POST /api/ai/recommend  { query, userPrefs }
3. Backend builds prompt: movie catalog + user history + query
4. Google Gemini API processes → returns recommendations
5. Backend formats response + fetches movie details from DB
6. Frontend renders chat bubble with movie cards + reasons
```

---

## 🎮 Mini Games

- **Movie Trivia** — Questions from Open Trivia DB API, win discount points
- **Memory Cards** — Match movie poster pairs, timed challenge
- **Lucky Spin** — Spin wheel for 5%–20% discount coupon on next booking

---

## 🌍 Location Feature

```
1. User allows browser geolocation
2. Browser Geolocation API → { latitude, longitude }
3. Frontend: GET /api/shows/nearby?lat=X&lng=Y&radius=20
4. Backend uses Haversine formula to filter theatres
5. Frontend renders Leaflet.js map with theatre markers
6. User clicks marker → sees available shows
```

---

## 🔔 Notification System

Notifications fire at:
- Seat hold expiry warning (9 min after selection)
- Payment success / failure
- AI recommendation ready
- Booking cancellation confirmation

---

## 🔐 Security Layers

| Layer       | Implementation                         |
|------------|----------------------------------------|
| Auth        | JWT in Authorization header            |
| Passwords   | Bcrypt (salt rounds: 12)              |
| HTTP        | Helmet.js security headers            |
| Rate limit  | 100 req/15min on auth routes          |
| Validation  | Joi schemas on all POST/PUT bodies    |
| CORS        | Whitelisted to VITE_CLIENT_URL only   |
| Webhooks    | Stripe signature verification         |

---

## 🛠️ Full Tech Stack

| Layer         | Tech                                    |
|---------------|-----------------------------------------|
| Frontend      | React 18 + Vite + Redux Toolkit         |
| Routing       | React Router v6                         |
| Styling       | Vanilla CSS + CSS Modules               |
| HTTP Client   | Axios                                   |
| Backend       | Node.js 18 + Express.js (MVC pattern)  |
| ORM           | Sequelize v6                            |
| Database      | PostgreSQL 14+                          |
| Auth          | JWT + bcrypt                            |
| Payments      | Stripe API (test mode)                  |
| AI            | Google Gemini 1.5 Flash                 |
| Maps          | Leaflet.js + OpenStreetMap              |
| Email         | Nodemailer                              |
| Notifications | React Hot Toast                         |
| Validation    | Joi                                     |
| Security      | Helmet, express-rate-limit, CORS        |

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- Stripe account (free test mode)
- Google AI Studio API key (free)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env          # Add your keys
npm run db:migrate            # Create tables
npm run db:seed               # Seed movies/theatres
npm run dev                   # http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env          # Add your keys
npm run dev                   # http://localhost:5173
```

### Required Environment Variables

**backend/.env**
```
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/cineverse
JWT_SECRET=your-super-secret-256bit-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GEMINI_API_KEY=AIza...
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
