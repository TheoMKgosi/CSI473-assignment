import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

const HomeScreen = ({ navigation, route }) => {
  const user = route.params?.user || { email: 'test@example.com', full_name: 'Test User' };

  const handleLogout = () => {
    Alert.alert('Logged Out', 'You have been logged out.');
    navigation.replace('Login');
  };

  const menuItems = [
    { 
      title: 'Community Forum', 
      subtitle: 'Connect with neighbors',
      icon: '💬',
      screen: 'Forum'
    },
    { 
      title: 'Patrol Statistics', 
      subtitle: 'View security metrics',
      icon: '📊',
      screen: 'PatrolStats'
    },
    { 
      title: 'Emergency Alert', 
      subtitle: 'Trigger SOS instantly',
      icon: '🚨',
      screen: 'Panic'
    },
    { 
      title: 'Subscription', 
      subtitle: 'Manage your plan',
      icon: '💰',
      screen: 'Subscription'
    },
    { 
      title: 'My Profile', 
      subtitle: 'Update your information',
      icon: '👤',
      screen: 'Profile'
    },
    { 
      title: 'Settings', 
      subtitle: 'App preferences',
      icon: '⚙️',
      screen: 'Settings'
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.userName}>{user.full_name}</Text>
          <Text style={styles.subtitle}>Neighborhood Watch Member</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile', { user })}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.notificationBanner}>
        <Text style={styles.notificationText}>🔔 3 new security alerts in your area</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Forum')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.menuCard}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('Panic')}>
            <Text style={styles.quickButtonIcon}>🚨</Text>
            <Text style={styles.quickButtonText}>Emergency</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('Forum')}>
            <Text style={styles.quickButtonIcon}>📝</Text>
            <Text style={styles.quickButtonText}>Post Alert</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.quickButtonIcon}>📍</Text>
            <Text style={styles.quickButtonText}>Share Location</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  welcome: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#61a3d2',
  },
  profileButton: {
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
  },
  profileIcon: {
    fontSize: 20,
  },
  notificationBanner: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  notificationText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
  },
  viewAllText: {
    fontSize: 12,
    color: '#61a3d2',
    fontWeight: '500',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  quickActions: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickButtonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  quickButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  logoutText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeScreen;