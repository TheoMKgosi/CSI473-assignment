export const API_CONFIG = {
  // For development - replace with your actual backend URL
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
  
  // For production, you might use:
  // BASE_URL: 'https://your-backend-domain.com',
};

export const ENDPOINTS = {
  SECURITY_LOGIN: '/api/security/login/',
  // Add other endpoints here
};