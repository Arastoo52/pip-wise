import dotenv from 'dotenv';
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
    : ['http://localhost:5173', 'http://localhost:5174'],
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: parseInt(process.env.SMTP_PORT || '465', 10) === 465,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
    fromName: process.env.SMTP_FROM_NAME || 'TradeSafe Brokers',
    fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
  },
};

// Guard against missing required variables in production
if (!config.mongoUri) {
  console.warn('⚠️ WARNING: MONGO_URI is not set in environment variables!');
}

export default config;
