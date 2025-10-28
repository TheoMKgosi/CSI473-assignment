import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const PanicScreen = () => {
  const [isPressed, setIsPressed] = useState(false);

  const triggerPanic = () => {
    setIsPressed(true);
    Alert.alert(
      '🚨 EMERGENCY ALERT SENT!',
      'Your location and details have been shared with security patrols and nearby neighbors.',
      [
        { 
          text: 'OK', 
          style: 'default',
          onPress: () => setIsPressed(false)
        }
      ]
    );
  };

  const emergencyContacts = [
    { name: 'Local Police', number: '999', icon: '👮' },
    { name: 'Security Base', number: '+267-123-4567', icon: '🏢' },
    { name: 'Medical Emergency', number: '997', icon: '🏥' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Alert System</Text>
        <Text style={styles.subtitle}>For immediate security threats</Text>
      </View>

      <View style={styles.alertSection}>
        <Text style={styles.alertTitle}>Trigger Emergency Alert</Text>
        <Text style={styles.alertDescription}>
          This will immediately notify all security officers and community members in your area with your current location.
        </Text>

        <TouchableOpacity 
          style={[styles.panicButton, isPressed && styles.panicButtonPressed]}
          onPress={triggerPanic}
          disabled={isPressed}
        >
          <Text style={styles.panicIcon}>🚨</Text>
          <Text style={styles.panicText}>EMERGENCY SOS</Text>
          <Text style={styles.panicSubtext}>Press in case of danger</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactsSection}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        {emergencyContacts.map((contact, index) => (
          <View key={index} style={styles.contactCard}>
            <Text style={styles.contactIcon}>{contact.icon}</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactNumber}>{contact.number}</Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callText}>📞 Call</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.footerNote}>
        Your safety is our priority. Use responsibly.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
    padding: 20,
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
  alertSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 10,
  },
  alertDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  panicButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 25,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  panicButtonPressed: {
    backgroundColor: '#b71c1c',
    transform: [{ scale: 0.98 }],
  },
  panicIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  panicText: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold',
    marginBottom: 5,
  },
  panicSubtext: { 
    color: '#ffcdd2', 
    fontSize: 12,
  },
  contactsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  contactCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 14,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#61a3d2',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  callText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  footerNote: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default PanicScreen;