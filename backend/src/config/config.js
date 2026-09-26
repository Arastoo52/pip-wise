import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded whether run from root or backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5001', 10),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'pipwise_jwt_fallback_secret_production_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieSecret: process.env.COOKIE_SECRET || 'pipwise_cookie_fallback_secret',
  corsOrigins: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : [
        'https://tradesafebrokers.com',
        'https://www.tradesafebrokers.com',
        'http://tradesafebrokers.com',
        'http://www.tradesafebrokers.com',
        'http://localhost:5173',
        'http://localhost:5174',
      ],
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: parseInt(process.env.SMTP_PORT || '465', 10) === 465,
    user: process.env.SMTP_USER || 'admin@tradesafebrokers.com',
    pass: process.env.SMTP_PASSWORD,
    fromName: process.env.SMTP_FROM_NAME || 'TradeSafe Brokers',
    fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'admin@tradesafebrokers.com',
  },
};

// Guard against missing required variables in production
if (!config.mongoUri) {
  console.warn('⚠️ WARNING: MONGO_URI is not set in environment variables!');
}

export default config;
