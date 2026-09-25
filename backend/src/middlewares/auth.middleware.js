import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import config from '../config/config.js';
import { AUTH_MESSAGES } from '../constants/index.js';

/**
 * JWT Authentication Middleware
 * Supports both HTTP-Only cookie and Authorization: Bearer <token> header
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '').trim();

    if (!token) {
      throw new ApiError(401, AUTH_MESSAGES.UNAUTHORIZED);
    }

    const decodedToken = jwt.verify(token, config.jwtSecret);

    const user = await User.findById(decodedToken?._id).select('-password');

    if (!user) {
      throw new ApiError(401, AUTH_MESSAGES.UNAUTHORIZED);
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account is deactivated. Please contact support.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, AUTH_MESSAGES.TOKEN_EXPIRED));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid authentication token'));
    }
    next(error);
  }
});

/**
 * Require Admin Middleware
 * Restricts access to users with role 'admin'
 */
export const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, AUTH_MESSAGES.UNAUTHORIZED);
  }

  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied. Administrator privileges required.');
  }

  next();
});

/**
 * Optional JWT Authentication Middleware
 * Populates req.user if a valid token is present, but doesn't reject if unauthenticated
 */
export const optionalVerifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '').trim();

    if (!token) {
      req.user = null;
      return next();
    }

    const decodedToken = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decodedToken?._id).select('-password');
    if (user && user.isActive) {
      req.user = user;
    } else {
      req.user = null;
    }
    next();
  } catch {
    req.user = null;
    next();
  }
});
