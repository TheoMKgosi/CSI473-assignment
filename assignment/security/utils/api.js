// app/utils/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
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
        config.headers.Authorization = `Token ${token}`;
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
    return this.request('/security/signup/', {
      method: 'POST',
      body: officerData,
    });
  },

  async loginOfficer(credentials) {
    return this.request('/security/login/', {
      method: 'POST',
      body: credentials,
    });
  },

  async getOfficerProfile() {
    return this.request('/security/profile/');
  },

  async getComplianceData() {
    return this.request('/security/compliance/');
  },

  async getRoute() {
    return this.request('/security/route/');
  },

  // Patrol endpoints
  async validateQRCode(qrData) {
    return this.request('/security/validate-qr/', {
      method: 'POST',
      body: { qr_data: qrData },
    });
  },

  async scanQRCode(scanData) {
    return this.request('/security/scan-qr/', {
      method: 'POST',
      body: scanData,
    });
  },

  async updateRouteProgress(routeId, checkpointId) {
    return this.request('/security/update-progress/', {
      method: 'POST',
      body: { route_id: routeId, checkpoint_id: checkpointId },
    });
  },

   async logScan(scanData) {
     return this.request('/security/log-scan/', {
       method: 'POST',
       body: scanData,
     });
   },

   async getPanicAlerts() {
     return this.request('/security/panic-alerts/');
   },

   async resolvePanicAlert(alertData) {
     return this.request('/security/resolve-alert/', {
       method: 'POST',
       body: alertData,
     });
   },
};

// Legacy function for compatibility
export async function signupOfficer(data) {
  return api.signupOfficer(data);
}