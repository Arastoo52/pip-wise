import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import config from './config/config.js';
import routes from './routes/index.js';
import seoRoutes from './routes/seo.routes.js';
import { apiLimiter } from './middlewares/rateLimiter.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { ApiError } from './utils/ApiError.js';

const app = express();

// Trust reverse proxy (needed for accurate rate limiting behind Nginx/Cloudflare)
app.set('trust proxy', 1);

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing (CORS)
const allowedOrigins = [
  ...config.corsOrigins,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      // Permissive in dev or for localhost, vercel, onrender, or configured origins
      if (
        config.env === 'development' ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// Payload compression for high network throughput
app.use(compression());

// Body Parsers with safe payload size limits (prevents payload flood attacks)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Cookie Parser
app.use(cookieParser(config.cookieSecret));

// Request Logger (dev mode)
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Dynamic SEO Endpoints (/robots.txt & /sitemap.xml)
app.use('/', seoRoutes);

// General API Rate Limiter
app.use('/api', apiLimiter);

// Root Welcome & Status
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PipWise Backend API is active and operational 🚀',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
      brokers: '/api/v1/brokers',
      admin: '/api/v1/admin',
    },
  });
});

// API Routes Mounting (v1, api, and direct shortcuts for maximum compatibility)
app.use('/api/v1', routes);
app.use('/api', routes);
app.use('/', routes);

// 404 Route Not Found Handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found on this server`));
});

// Centralized Global Error Handler
app.use(errorHandler);

export default app;
