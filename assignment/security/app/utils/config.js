// app/utils/config.js
export const API_CONFIG = {
  // Use the new port 8002
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8002',
};

export const ENDPOINTS = {
  SECURITY_LOGIN: '/api/security/login/',
  SECURITY_SIGNUP: '/api/security/signup/',
  SECURITY_PROFILE: '/api/security/profile/',
};