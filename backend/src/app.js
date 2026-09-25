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
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (config.corsOrigins.includes(origin) || config.env === 'development') {
        return callback(null, true);
      }
      return callback(new ApiError(403, 'Not allowed by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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

// API Routes Mounting (v1)
app.use('/api/v1', routes);

// 404 Route Not Found Handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found on this server`));
});

// Centralized Global Error Handler
app.use(errorHandler);

export default app;
