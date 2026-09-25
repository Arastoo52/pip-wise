# PipWise Backend API

Production-ready backend API service for the PipWise Forex Review & Broker Comparison platform built with Node.js, Express, MongoDB, and JWT authentication.

## 🚀 Features

- **Authentication & Authorization**:
  - Secure registration and login with bcrypt password hashing
  - JWT-based authentication stored in HTTP-only cookies
  - Email OTP verification (Hostinger SMTP integration)
  - Role-Based Access Control (User & Admin roles)
- **Broker Management API**:
  - Full CRUD operations for Forex broker profiles
  - Dynamic ratings, pros/cons, deposit limits, regulatory bodies
  - Comparison endpoints and real-time updates
- **Testimonials & Reviews**:
  - Verified trader review submissions and rating calculations
- **Security & Reliability**:
  - Helmet for HTTP security headers
  - CORS security configured for frontend origins
  - Rate limiting via `express-rate-limit` against brute-force attacks
  - Input validation and sanitization using `express-validator`
  - Centralized error handling and async wrapper

## 📁 Architecture

```
backend/
├── src/
│   ├── app.js                 # Express app initialization & middleware stack
│   ├── config/
│   │   ├── config.js          # Environment configuration
│   │   └── db.js              # MongoDB Mongoose connection
│   ├── constants/             # Seed data and application constants
│   ├── controllers/           # API request controllers (auth, broker, admin, testimonial)
│   ├── middlewares/           # Auth, error, rate-limiting, validation middlewares
│   ├── models/                # Mongoose database schemas
│   ├── routes/                # Modular Express routers
│   ├── services/              # External services (email/SMTP)
│   ├── utils/                 # ApiError, ApiResponse, asyncHandler helpers
│   └── validations/           # Request validation schemas
├── package.json               # Backend dependencies and scripts
└── server.js                  # HTTP server entrypoint
```

## 🛠️ Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- MongoDB database (local or MongoDB Atlas)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the `backend/` directory with the following variables:
```bash
touch .env
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend server port | `5001` |
| `NODE_ENV` | Environment (`development` / `production`) | `development` |
| `MONGO_URI` | MongoDB connection connection string | — |
| `JWT_SECRET` | Secret key for signing JWT tokens | — |
| `JWT_EXPIRES_IN` | Token expiration period | `7d` |
| `COOKIE_SECRET` | Secret key for signing cookies | — |
| `CORS_ORIGIN` | Allowed client origins (comma-separated) | `http://localhost:5173,http://localhost:5174` |
| `SMTP_HOST` | Hostinger / SMTP Host | `smtp.hostinger.com` |
| `SMTP_PORT` | SMTP port (465 for SSL) | `465` |
| `SMTP_USER` | SMTP username / email address | — |
| `SMTP_PASSWORD` | SMTP password | — |

### 4. Run the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

## 🌐 API Overview

- `POST /api/auth/register` — Register a new account (triggers OTP email)
- `POST /api/auth/verify-otp` — Verify email OTP and activate account
- `POST /api/auth/login` — Sign in and receive auth cookie/token
- `POST /api/auth/logout` — Clear session / cookies
- `GET /api/auth/me` — Get current authenticated user profile
- `GET /api/brokers` — Get list of brokers with filters and sorting
- `GET /api/brokers/:slug` — Get detailed broker profile
- `POST /api/brokers` — (Admin only) Create or update broker listing
- `GET /api/testimonials` — Get testimonials & reviews
