// app/utils/config.js
export const API_CONFIG = {
  // Use environment variable or fallback to localhost
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
};

export const ENDPOINTS = {
  SECURITY_LOGIN: '/api/security/login/',
  SECURITY_SIGNUP: '/api/security/signup/',
  SECURITY_PROFILE: '/api/security/profile/',
  CURRENT_ROUTE: '/api/security/current-route/',
  VALIDATE_QR: '/api/security/validate-qr/',
  UPDATE_PROGRESS: '/api/security/update-progress/',
};