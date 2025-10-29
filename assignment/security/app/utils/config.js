// app/utils/config.js
export const API_CONFIG = {
  // For development - use your actual backend URL
  // For Android emulator: http://10.0.2.2:8000
  // For iOS simulator: http://localhost:8000
  // For physical device: http://your-computer-ip:8000
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
};

export const ENDPOINTS = {
  SECURITY_LOGIN: '/api/security/login/',
  SECURITY_SIGNUP: '/api/security/signup/',
  SECURITY_PROFILE: '/api/security/profile/',
};