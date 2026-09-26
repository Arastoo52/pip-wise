/**
 * Backend Constants & Security Options
 */
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'User logged in successfully',
  LOGOUT_SUCCESS: 'User logged out successfully',
  PROFILE_FETCHED: 'User profile fetched successfully',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User with this email or username already exists',
  USER_NOT_FOUND: 'User does not exist',
  UNAUTHORIZED: 'Unauthorized request: please log in to continue',
  TOKEN_EXPIRED: 'Token has expired or is invalid',
};
