import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { api } from '../../utils/api';

const SettingsScreen = () => {
  const router = useRouter();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    gpsTracking: true,
    autoUpload: false,
    vibration: true,
  });
  const [officerProfile, setOfficerProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOfficerProfile();
    loadSettings();
  }, []);

  const loadOfficerProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token && token !== 'demo-token') {
        const profileResponse = await api.getOfficerProfile();
        const profileData = profileResponse.profile;
        const userData = profileResponse.user;

        setOfficerProfile({
          name: `${userData.first_name} ${userData.last_name}`,
          badgeNumber: profileData.employee_id,
          email: userData.email,
          department: 'Security Division', // Mock for now
          joinDate: 'Unknown', // Not in API response
        });
      } else {
        // Demo mode
        setOfficerProfile({
          name: 'Demo Officer',
          badgeNumber: 'DEMO-001',
          email: 'demo@security.com',
          department: 'Demo Division',
          joinDate: 'Today',
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Fallback data
      setOfficerProfile({
        name: 'Security Officer',
        badgeNumber: 'N/A',
        email: 'user@example.com',
        department: 'Security',
        joinDate: 'Unknown',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const toggleSetting = async (setting) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting]
    };
    
    setSettings(newSettings);
    
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear all stored data
      await AsyncStorage.multiRemove(['token', 'userData', 'userRole', 'isDemo']);
      // Navigate to login
      router.push('/(auth)/login');
    } catch (e) {
      console.error('Logout error:', e);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const performLogout = async () => {
    try {
      // Clear all stored data
      await AsyncStorage.multiRemove(['token', 'userData', 'userRole', 'isDemo']);
      // Navigate to login
      router.push('/(auth)/login');
    } catch (e) {
      console.error('Logout error:', e);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleMenuPress = (item) => {
    Alert.alert('Feature Coming Soon', `${item} functionality will be available in the next update.`);
  };

  if (isLoading || !officerProfile) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {officerProfile.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <Text style={styles.profileName}>{officerProfile.name}</Text>
        <Text style={styles.profileBadge}>{officerProfile.badgeNumber}</Text>
        <Text style={styles.profileDepartment}>{officerProfile.department}</Text>
        <Text style={styles.profileEmail}>{officerProfile.email}</Text>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>Receive patrol alerts and updates</Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={() => toggleSetting('notifications')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={settings.notifications ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Vibration Alerts</Text>
            <Text style={styles.settingDescription}>Haptic feedback for notifications</Text>
          </View>
          <Switch
            value={settings.vibration}
            onValueChange={() => toggleSetting('vibration')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={settings.vibration ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('Edit Profile')}>
          <Text style={styles.menuText}>Edit Profile</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('Change Password')}>
          <Text style={styles.menuText}>Change Password</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('Privacy & Security')}>
          <Text style={styles.menuText}>Privacy & Security</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('Help & Documentation')}>
          <Text style={styles.menuText}>Help & Documentation</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('Report an Issue')}>
          <Text style={styles.menuText}>Report an Issue</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('Contact Supervisor')}>
          <Text style={styles.menuText}>Contact Supervisor</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Last Updated</Text>
          <Text style={styles.infoValue}>Today</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Developer</Text>
          <Text style={styles.infoValue}>Security Systems</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Security Officer App v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    backgroundColor: 'white',
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileBadge: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  profileDepartment: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  profileEmail: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  menuArrow: {
    fontSize: 20,
    color: '#999',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    margin: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
});

export default SettingsScreen;
