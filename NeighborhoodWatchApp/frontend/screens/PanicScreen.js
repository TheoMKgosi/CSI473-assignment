import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Linking } from 'react-native';

const PanicScreen = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [emergencyCountdown, setEmergencyCountdown] = useState(null);

  const triggerPanic = () => {
    setIsPressed(true);
    
    // Start countdown
    let countdown = 5;
    setEmergencyCountdown(countdown);
    
    const countdownInterval = setInterval(() => {
      countdown -= 1;
      setEmergencyCountdown(countdown);
      
      if (countdown === 0) {
        clearInterval(countdownInterval);
        sendEmergencyAlert();
      }
    }, 1000);

    // Cancel option
    Alert.alert(
      '🚨 EMERGENCY ALERT',
      `Emergency alert will be sent in ${countdown} seconds. Cancel if this was accidental.`,
      [
        { 
          text: 'CANCEL EMERGENCY', 
          style: 'destructive',
          onPress: () => {
            clearInterval(countdownInterval);
            setIsPressed(false);
            setEmergencyCountdown(null);
            Alert.alert('Cancelled', 'Emergency alert cancelled.');
          }
        }
      ]
    );
  };

  const sendEmergencyAlert = () => {
    // Simulate sending alert to backend
    const emergencyData = {
      type: 'panic_button',
      timestamp: new Date().toISOString(),
      location: 'Current User Location',
      user: 'demo1@neighborhood.com'
    };

    console.log('Emergency alert sent:', emergencyData);
    
    Alert.alert(
      '🚨 EMERGENCY ALERT SENT!',
      'Your location and emergency details have been shared with:\n\n• Security patrols\n• Nearby neighbors\n• Emergency services\n\nHelp is on the way!',
      [
        { 
          text: 'OK', 
          style: 'default',
          onPress: () => {
            setIsPressed(false);
            setEmergencyCountdown(null);
          }
        },
        {
          text: 'Call Emergency Services',
          onPress: () => Linking.openURL('tel:999')
        }
      ]
    );

    // Simulate push notification to other users
    simulatePushNotification();
  };

  const simulatePushNotification = () => {
    // In a real app, this would send push notifications to nearby users
    Alert.alert(
      '📢 Community Alert',
      'Emergency alert sent to nearby residents. Neighbors have been notified to stay alert.',
      [{ text: 'OK' }]
    );
  };

  const callEmergency = (number) => {
    Linking.openURL(`tel:${number}`)
      .catch(err => Alert.alert('Error', 'Could not make call'));
  };

  const emergencyContacts = [
    { name: 'Local Police', number: '999', icon: '👮', color: '#1976d2' },
    { name: 'Security Base', number: '+267-123-4567', icon: '🏢', color: '#388e3c' },
    { name: 'Medical Emergency', number: '997', icon: '🏥', color: '#d32f2f' },
    { name: 'Fire Department', number: '998', icon: '🚒', color: '#f57c00' },
    { name: 'Neighborhood Watch', number: '+267-765-4321', icon: '🛡️', color: '#7b1fa2' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Alert System</Text>
        <Text style={styles.subtitle}>For immediate security threats</Text>
      </View>

      <View style={styles.alertSection}>
        <Text style={styles.alertTitle}>Trigger Emergency Alert</Text>
        <Text style={styles.alertDescription}>
          This will immediately notify all security officers, emergency services, and community members in your area with your current location.
        </Text>

        <TouchableOpacity 
          style={[
            styles.panicButton, 
            isPressed && styles.panicButtonPressed,
            emergencyCountdown && styles.panicButtonCountdown
          ]}
          onPress={triggerPanic}
          disabled={isPressed}
        >
          <Text style={styles.panicIcon}>🚨</Text>
          <Text style={styles.panicText}>
            {emergencyCountdown ? `SENDING IN ${emergencyCountdown}` : 'EMERGENCY SOS'}
          </Text>
          <Text style={styles.panicSubtext}>
            {emergencyCountdown ? 'Cancel if accidental' : 'Press in case of danger'}
          </Text>
        </TouchableOpacity>

        <View style={styles.emergencyInfo}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoItem}>• 📍 Shares your live location</Text>
          <Text style={styles.infoItem}>• 📢 Alerts nearby residents</Text>
          <Text style={styles.infoItem}>• 🚔 Notifies security patrols</Text>
          <Text style={styles.infoItem}>• ⏱️ 24/7 immediate response</Text>
        </View>
      </View>

      <View style={styles.contactsSection}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <Text style={styles.contactsSubtitle}>Direct contact for specific emergencies</Text>
        
        {emergencyContacts.map((contact, index) => (
          <View key={index} style={styles.contactCard}>
            <View style={[styles.contactIcon, { backgroundColor: contact.color }]}>
              <Text style={styles.contactIconText}>{contact.icon}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactNumber}>{contact.number}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.callButton, { backgroundColor: contact.color }]}
              onPress={() => callEmergency(contact.number)}
            >
              <Text style={styles.callText}>📞 Call</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.safetyTips}>
        <Text style={styles.sectionTitle}>Safety Tips</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>• Stay in a well-lit area if possible</Text>
          <Text style={styles.tipText}>• Keep your phone accessible</Text>
          <Text style={styles.tipText}>• Provide clear location details</Text>
          <Text style={styles.tipText}>• Stay on the line with emergency services</Text>
        </View>
      </View>

      <Text style={styles.footerNote}>
        Your safety is our priority. Use responsibly for genuine emergencies only.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
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
  alertSection: {
    backgroundColor: '#fff',
    padding: 20,
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
    marginBottom: 20,
  },
  panicButtonPressed: {
    backgroundColor: '#b71c1c',
  },
  panicButtonCountdown: {
    backgroundColor: '#ff6d00',
    transform: [{ scale: 1.05 }],
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
  emergencyInfo: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  infoItem: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 4,
  },
  contactsSection: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  contactsSubtitle: {
    fontSize: 14,
    color: '#666',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactIconText: {
    fontSize: 18,
    color: '#fff',
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
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  callText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  safetyTips: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  tipCard: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  tipText: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 5,
    lineHeight: 20,
  },
  footerNote: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
});

export default PanicScreen;