import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError.js';

/**
 * Strict Rate Limiter for Authentication Endpoints (Login & Register)
 * Prevents brute force credential stuffing attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ApiError(429, 'Too many authentication attempts from this IP. Please try again after 15 minutes.'));
  },
});

/**
 * General API Rate Limiter
 * Protects against DDoS while comfortably supporting 5,000+ normal users
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ApiError(429, 'Too many requests created from this IP. Please slow down.'));
  },
});

/**
 * Strict OTP Rate Limiter
 * Prevents OTP SMS/Email flooding and brute-force enumeration
 */
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Max 10 OTP-related requests per 10 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ApiError(429, 'Too many OTP requests. Please wait a few minutes before trying again.'));
  },
});
