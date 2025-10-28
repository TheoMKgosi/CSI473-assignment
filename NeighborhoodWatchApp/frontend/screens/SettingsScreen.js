import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch } from 'react-native';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    locationSharing: true,
    emergencyAlerts: true,
    communityUpdates: true,
    darkMode: false,
    biometricAuth: false,
    dataSaver: false
  });

  const toggleSetting = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
    
    // Simulate push notification for important setting changes
    if (setting === 'emergencyAlerts' || setting === 'pushNotifications') {
      Alert.alert(
        '📢 Notification Setting Updated',
        `${setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${!settings[setting] ? 'enabled' : 'disabled'}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear App Data',
      'This will remove all cached data and preferences. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Data Cleared', 'All app data has been cleared.');
          }
        }
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Would you like to contact our support team?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email Support', onPress: () => Alert.alert('Email', 'support@neighborhoodwatch.com') },
        { text: 'Call Support', onPress: () => Alert.alert('Call', '+267-800-1234') }
      ]
    );
  };

  const settingGroups = [
    {
      title: 'Notifications',
      settings: [
        { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive app notifications' },
        { key: 'emergencyAlerts', label: 'Emergency Alerts', description: 'Critical security alerts' },
        { key: 'communityUpdates', label: 'Community Updates', description: 'Neighborhood news and posts' },
      ]
    },
    {
      title: 'Privacy & Security',
      settings: [
        { key: 'locationSharing', label: 'Location Sharing', description: 'Share location during emergencies' },
        { key: 'biometricAuth', label: 'Biometric Authentication', description: 'Use fingerprint or face ID' },
        { key: 'dataSaver', label: 'Data Saver Mode', description: 'Reduce data usage' },
      ]
    },
    {
      title: 'Appearance',
      settings: [
        { key: 'darkMode', label: 'Dark Mode', description: 'Use dark theme' },
      ]
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your app experience</Text>
      </View>

      {settingGroups.map((group, groupIndex) => (
        <View key={groupIndex} style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          {group.settings.map((setting, settingIndex) => (
            <View key={setting.key} style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{setting.label}</Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </View>
              <Switch
                value={settings[setting.key]}
                onValueChange={() => toggleSetting(setting.key)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={settings[setting.key] ? '#61a3d2' : '#f4f3f4'}
              />
            </View>
          ))}
        </View>
      ))}

      <View style={styles.actionsGroup}>
        <Text style={styles.groupTitle}>App Actions</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleContactSupport}>
          <Text style={styles.actionButtonText}>📞 Contact Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📖 User Guide</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🔄 Check for Updates</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleClearData}>
          <Text style={[styles.actionButtonText, styles.dangerAction]}>🗑️ Clear App Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.appInfo}>
        <Text style={styles.appInfoTitle}>App Information</Text>
        <Text style={styles.appInfoText}>Version 1.0.0</Text>
        <Text style={styles.appInfoText}>Neighborhood Watch Security</Text>
        <Text style={styles.appInfoText}>© 2024 All rights reserved</Text>
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
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingsGroup: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  actionsGroup: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dangerAction: {
    color: '#d32f2f',
  },
  appInfo: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  appInfoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});

export default SettingsScreen;