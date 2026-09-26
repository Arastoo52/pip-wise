import axios from 'axios';

/**
 * Base API Client configured for PipWise backend
 * withCredentials: true ensures HTTP-Only cookies are sent and received
 */
const getBaseUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return 'http://localhost:5001/api/v1';

  // If user accidentally entered "VITE_API_URL=https://..." in Vercel Value field
  if (typeof envUrl === 'string' && envUrl.includes('=')) {
    const parts = envUrl.split('=');
    envUrl = parts.slice(1).join('=');
  }

  let clean = String(envUrl).trim().replace(/^['"]|['"]$/g, '').replace(/\/+$/, '');

  // If user provided a domain without protocol, auto-prepend https://
  if (clean && !clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}`;
  }

  if (!clean) return 'http://localhost:5001/api/v1';

  return clean.endsWith('/api/v1') ? clean : `${clean}/api/v1`;
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach Bearer token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('pipwise_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Unable to access localStorage for auth token:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      statusCode: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred. Please try again.',
      errors: error.response?.data?.errors || [],
    };
    return Promise.reject(customError);
  }
);

export default apiClient;
