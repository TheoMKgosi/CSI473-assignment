// app/utils/config.js
export const API_CONFIG = {
  // Use the new port 8002
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
};

export const ENDPOINTS = {
  SECURITY_LOGIN: '/security/login/',
  SECURITY_SIGNUP: '/security/signup/',
  SECURITY_PROFILE: '/security/profile/',
};
