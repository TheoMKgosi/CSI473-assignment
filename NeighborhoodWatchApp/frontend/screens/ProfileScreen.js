import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './api';
import { showAlert, showError, showSuccess } from '../utils/alert';

const ProfileScreen = ({ navigation, route }) => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '+267-765-4321',
    notifications: true,
    locationSharing: true
  });

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState('basic'); // Mock current subscription
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        showError('Not logged in');
        navigation.replace('Login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/members/profile/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setProfile({
          fullName: data.user.full_name,
          email: data.user.email,
          phone: data.user.phone,
          address: data.user.address,
          emergencyContact: '+267-765-4321',
          notifications: true,
          locationSharing: true
        });
      } else {
        showError('Failed to load profile');
      }
    } catch (error) {
        showError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    showSuccess('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const toggleSetting = (setting) => {
    setProfile({ ...profile, [setting]: !profile[setting] });
  };

  const handleUpgradeSubscription = async (plan) => {
    if (!user || !user.email) {
      Alert.alert('Error', 'Profile not loaded. Please wait and try again.');
      return;
    }

    setIsUpgrading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Not logged in');
        navigation.replace('Login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/members/pay-subscription/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Token ${token}` : '',
        },
        body: JSON.stringify({
          subscription_type: plan,
          amount: plan === 'premium' ? 100 : 500,
          email: user.email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `Upgraded to ${plan} plan!`);
        setCurrentSubscription(plan);
      } else {
        Alert.alert('Error', data.errors || 'Upgrade failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.fullName.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profile.fullName}</Text>
            <Text style={styles.userEmail}>{profile.email}</Text>
            <Text style={styles.userStatus}>🟢 Active Member</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profile.fullName}
            onChangeText={(text) => handleChange('fullName', text)}
            editable={isEditing}
            placeholder="Enter your full name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profile.email}
            onChangeText={(text) => handleChange('email', text)}
            editable={isEditing}
            keyboardType="email-address"
            placeholder="Enter your email"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profile.phone}
            onChangeText={(text) => handleChange('phone', text)}
            editable={isEditing}
            keyboardType="phone-pad"
            placeholder="Enter your phone number"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profile.address}
            onChangeText={(text) => handleChange('address', text)}
            editable={isEditing}
            multiline
            placeholder="Enter your address"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Emergency Contact</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profile.emergencyContact}
            onChangeText={(text) => handleChange('emergencyContact', text)}
            editable={isEditing}
            keyboardType="phone-pad"
            placeholder="Emergency contact number"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingDescription}>Receive security alerts and updates</Text>
          </View>
          <TouchableOpacity 
            style={[styles.toggle, profile.notifications && styles.toggleActive]}
            onPress={() => toggleSetting('notifications')}
          >
            <Text style={styles.toggleText}>
              {profile.notifications ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Location Sharing</Text>
            <Text style={styles.settingDescription}>Share location during emergencies</Text>
          </View>
          <TouchableOpacity 
            style={[styles.toggle, profile.locationSharing && styles.toggleActive]}
            onPress={() => toggleSetting('locationSharing')}
          >
            <Text style={styles.toggleText}>
              {profile.locationSharing ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Statistics</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Posts Made</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Alerts Received</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Incidents Reported</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>89%</Text>
            <Text style={styles.statLabel}>Safety Score</Text>
          </View>
        </View>
       </View>

       <View style={styles.section}>
         <Text style={styles.sectionTitle}>Subscription Plan</Text>
         <Text style={styles.currentPlan}>Current Plan: <Text style={styles.planName}>{currentSubscription.toUpperCase()}</Text></Text>

         <View style={styles.plansContainer}>
           <View style={styles.planCard}>
             <Text style={styles.planTitle}>Premium</Text>
             <Text style={styles.planPrice}>P100/month</Text>
             <Text style={styles.planFeatures}>• Priority alerts{'\n'}• Advanced analytics{'\n'}• 24/7 support</Text>
             <TouchableOpacity
               style={[styles.upgradeButton, (currentSubscription === 'premium' || isLoading || isUpgrading) && styles.upgradeButtonDisabled]}
               onPress={() => handleUpgradeSubscription('premium')}
               disabled={currentSubscription === 'premium' || isLoading || isUpgrading}
             >
               <Text style={styles.upgradeButtonText}>
                 {isUpgrading && currentSubscription !== 'premium' ? 'Upgrading...' : currentSubscription === 'premium' ? 'Current Plan' : 'Upgrade'}
               </Text>
             </TouchableOpacity>
           </View>

           <View style={styles.planCard}>
             <Text style={styles.planTitle}>Enterprise</Text>
             <Text style={styles.planPrice}>P500/month</Text>
             <Text style={styles.planFeatures}>• All Premium features{'\n'}• Custom integrations{'\n'}• Dedicated account manager</Text>
             <TouchableOpacity
               style={[styles.upgradeButton, (currentSubscription === 'enterprise' || isLoading || isUpgrading) && styles.upgradeButtonDisabled]}
               onPress={() => handleUpgradeSubscription('enterprise')}
               disabled={currentSubscription === 'enterprise' || isLoading || isUpgrading}
             >
               <Text style={styles.upgradeButtonText}>
                 {isUpgrading && currentSubscription !== 'enterprise' ? 'Upgrading...' : currentSubscription === 'enterprise' ? 'Current Plan' : 'Upgrade'}
               </Text>
             </TouchableOpacity>
           </View>
         </View>
       </View>

       {isEditing && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.dangerSection}>
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        <TouchableOpacity style={styles.dangerButton}>
          <Text style={styles.dangerButtonText}>Delete Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#61a3d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 12,
    color: '#4CAF50',
  },
  editButton: {
    backgroundColor: '#61a3d2',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  toggle: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  toggleActive: {
    backgroundColor: '#61a3d2',
  },
  toggleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#61a3d2',
    marginBottom: 5,
  },
   statLabel: {
     fontSize: 12,
     color: '#666',
     textAlign: 'center',
   },
   currentPlan: {
     fontSize: 16,
     color: '#333',
     marginBottom: 15,
   },
   planName: {
     fontWeight: 'bold',
     color: '#61a3d2',
   },
   plansContainer: {
     flexDirection: 'row',
     justifyContent: 'space-between',
   },
   planCard: {
     backgroundColor: '#f8f9fa',
     padding: 15,
     borderRadius: 10,
     width: '48%',
     alignItems: 'center',
   },
   planTitle: {
     fontSize: 18,
     fontWeight: 'bold',
     color: '#333',
     marginBottom: 5,
   },
   planPrice: {
     fontSize: 16,
     color: '#61a3d2',
     fontWeight: '600',
     marginBottom: 10,
   },
   planFeatures: {
     fontSize: 12,
     color: '#666',
     textAlign: 'center',
     marginBottom: 15,
     lineHeight: 18,
   },
   upgradeButton: {
     backgroundColor: '#61a3d2',
     paddingVertical: 8,
     paddingHorizontal: 15,
     borderRadius: 6,
     width: '100%',
     alignItems: 'center',
   },
   upgradeButtonDisabled: {
     backgroundColor: '#cccccc',
   },
   upgradeButtonText: {
     color: '#fff',
     fontSize: 12,
     fontWeight: '600',
   },
  actions: {
    padding: 20,
  },
  saveButton: {
    backgroundColor: '#61a3d2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerSection: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 10,
  },
  dangerButton: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  dangerButtonText: {
    color: '#d32f2f',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#666',
  },
  logoutButtonText: {
    color: '#666',
    fontWeight: '500',
  },
});

export default ProfileScreen;