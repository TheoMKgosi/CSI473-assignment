// app/utils/api.js
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

    // Add auth token if available
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('No token found');
    }

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

  // Auth endpoints
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

  async getOfficerProfile() {
    return this.request('/api/security/profile/');
  },

  // Patrol endpoints
  async getCurrentRoute() {
    return this.request('/api/security/current-route/');
  },

  async validateQRCode(qrData, routeId) {
    return this.request('/api/security/validate-qr/', {
      method: 'POST',
      body: { qr_data: qrData, route_id: routeId },
    });
  },

  async updateRouteProgress(routeId, checkpointId) {
    return this.request('/api/security/update-progress/', {
      method: 'POST',
      body: { route_id: routeId, checkpoint_id: checkpointId },
    });
  },
};

// Legacy function for compatibility
export async function signupOfficer(data) {
  return api.signupOfficer(data);
}