import apiClient from './api.client.js';

/**
 * Authentication Service (Layer 1)
 * Encapsulates all auth-related API requests to PipWise backend
 */
export const authService = {
  /**
   * Register a new user (triggers 4-digit OTP email)
   * @param {{ email: string, username: string, password: string }} credentials
   */
  async register(credentials) {
    return await apiClient.post('/auth/register', credentials);
  },

  /**
   * Verify 4-digit OTP code
   * @param {{ email: string, otp: string }} payload
   */
  async verifyOtp(payload) {
    return await apiClient.post('/auth/verify-otp', payload);
  },

  /**
   * Resend 4-digit OTP code
   * @param {{ email: string }} payload
   */
  async resendOtp(payload) {
    return await apiClient.post('/auth/resend-otp', payload);
  },

  /**
   * Log in an existing user
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    return await apiClient.post('/auth/login', credentials);
  },

  /**
   * Fetch current authenticated user's profile
   */
  async getMe() {
    return await apiClient.get('/auth/me');
  },

  /**
   * Log out user and clear cookie session
   */
  async logout() {
    return await apiClient.post('/auth/logout');
  },
};

export default authService;
