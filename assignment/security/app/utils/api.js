import { API_CONFIG } from './config';

export const api = {
  async request(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.detail || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  async signupOfficer(officerData) {
    return this.request('/api/security/signup/', {
      method: 'POST',
      body: officerData,
    });
  },

  async loginOfficer(credentials) {
    return this.request('/api/security/login/', {
      method: 'POST',
      body: credentials,
    });
  },

  async getOfficerProfile(token) {
    return this.request('/api/security/profile/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};