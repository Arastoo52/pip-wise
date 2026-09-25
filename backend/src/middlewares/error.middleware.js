import { ApiError } from '../utils/ApiError.js';
import config from '../config/config.js';

/**
 * Centralized Global Error Handling Middleware
 * Ensures all errors (operational, database, unexpected) return uniform JSON
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `A user with this ${field} already exists.`;
    error = new ApiError(409, message);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = new ApiError(400, errors[0]?.message || 'Validation Error', errors);
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    error = new ApiError(400, `Invalid resource identifier: ${err.value}`);
  }

  // Fallback for non-ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(config.env === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};
