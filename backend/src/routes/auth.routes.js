import { Router } from 'express';
import {
  register,
  login,
  verifyOtp,
  resendOtp,
  testSmtpConnection,
  getMe,
  logout,
  submitKyc,
  getKycStatus,
} from '../controllers/auth.controller.js';
import {
  registerValidation,
  loginValidation,
  verifyOtpValidation,
  resendOtpValidation,
} from '../validations/auth.validation.js';
import { validate } from '../middlewares/validate.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authLimiter, otpLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

// Public routes with rate limiting and strict body validation
router.route('/register').post(authLimiter, registerValidation, validate, register);
router.route('/login').post(authLimiter, loginValidation, validate, login);

// 4-Digit OTP verification & resend routes
router.route('/verify-otp').post(otpLimiter, verifyOtpValidation, validate, verifyOtp);
router.route('/resend-otp').post(otpLimiter, resendOtpValidation, validate, resendOtp);
router.route('/send-otp').post(otpLimiter, resendOtpValidation, validate, resendOtp);

// Safe SMTP connection test endpoint (zero credentials exposed)
router.route('/smtp-test').get(otpLimiter, testSmtpConnection);

// Protected routes requiring valid JWT authentication
router.route('/me').get(verifyJWT, getMe);
router.route('/logout').post(verifyJWT, logout);

// User KYC verification routes
router.route('/kyc/submit').post(verifyJWT, submitKyc);
router.route('/kyc/status').get(verifyJWT, getKycStatus);

export default router;
