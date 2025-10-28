import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';

const ProfileScreen = ({ navigation, route }) => {
  const user = route.params?.user || { 
    email: 'demo1@neighborhood.com', 
    full_name: 'Sarah Johnson',
    phone: '+267-123-4567',
    address: '123 Oak Street, Gaborone'
  };

  const [profile, setProfile] = useState({
    fullName: user.full_name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    emergencyContact: '+267-765-4321',
    notifications: true,
    locationSharing: true
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated successfully!');
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const toggleSetting = (setting) => {
    setProfile({ ...profile, [setting]: !profile[setting] });
  };

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