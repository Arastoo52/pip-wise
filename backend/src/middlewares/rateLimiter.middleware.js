import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError.js';

/**
 * Strict Rate Limiter for Authentication Endpoints (Login & Register)
 * Prevents brute force credential stuffing attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Generous limit so users and devs are never blocked
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false, xForwardedForHeader: false },
  handler: (req, res, next) => {
    next(new ApiError(429, 'Too many authentication attempts. Please try again in a few moments.'));
  },
});

/**
 * General API Rate Limiter
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // High limit for smooth production operation
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false, xForwardedForHeader: false },
  handler: (req, res, next) => {
    next(new ApiError(429, 'Too many requests created from this IP. Please slow down.'));
  },
});

/**
 * OTP Rate Limiter
 */
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 500, // High limit so user testing and verifications are never blocked
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false, xForwardedForHeader: false },
  handler: (req, res, next) => {
    next(new ApiError(429, 'Too many OTP requests. Please wait a moment before trying again.'));
  },
});
