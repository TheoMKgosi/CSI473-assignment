import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

const SubscriptionScreen = () => {
  const [status, setStatus] = useState('active');
  const [plan, setPlan] = useState('premium');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handlePayment = (amount) => {
    Alert.alert(
      'Payment Confirmation',
      `Process payment of P${amount} for Neighborhood Watch Premium?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Payment',
          style: 'default',
          onPress: () => {
            Alert.alert('Success', `Payment of P${amount} processed successfully!`);
            setStatus('active');
            setPlan('premium');
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to premium features.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel Anyway',
          style: 'destructive',
          onPress: () => {
            setStatus('cancelled');
            setPlan('basic');
            Alert.alert('Cancelled', 'Your subscription has been cancelled.');
          },
        },
      ]
    );
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    Alert.alert(
      'Notifications', 
      `Push notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`
    );
  };

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      features: ['Basic alerts', 'Community forum access', 'Limited patrol stats', 'Email support'],
      icon: '🔓',
      active: plan === 'basic'
    },
    {
      name: 'Premium',
      price: 'P100/month',
      features: ['Real-time alerts', 'Full patrol statistics', 'Priority support', 'Emergency SOS', 'Advanced analytics', '24/7 monitoring'],
      icon: '⭐',
      active: plan === 'premium'
    },
  ];

  const paymentHistory = [
    { id: 1, date: 'Oct 28, 2024', amount: 'P100', status: 'Completed' },
    { id: 2, date: 'Sep 28, 2024', amount: 'P100', status: 'Completed' },
    { id: 3, date: 'Aug 28, 2024', amount: 'P100', status: 'Completed' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Subscription Management</Text>
        <View style={[styles.statusBadge, status === 'active' ? styles.activeBadge : styles.cancelledBadge]}>
          <Text style={styles.statusText}>
            {status === 'active' ? '🟢 ACTIVE' : '🔴 CANCELLED'}
          </Text>
        </View>
      </View>

      <View style={styles.plansSection}>
        <Text style={styles.sectionTitle}>Available Plans</Text>
        {plans.map((planItem, index) => (
          <View 
            key={index} 
            style={[
              styles.planCard, 
              planItem.active && styles.activePlanCard
            ]}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planIcon}>{planItem.icon}</Text>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>{planItem.name}</Text>
                <Text style={styles.planPrice}>{planItem.price}</Text>
              </View>
              {planItem.active && (
                <View style={styles.currentPlanBadge}>
                  <Text style={styles.currentPlanText}>Current Plan</Text>
                </View>
              )}
            </View>
            
            <View style={styles.featuresList}>
              {planItem.features.map((feature, featureIndex) => (
                <Text key={featureIndex} style={styles.featureItem}>
                  ✓ {feature}
                </Text>
              ))}
            </View>

            {!planItem.active && planItem.name === 'Premium' && (
              <TouchableOpacity 
                style={styles.subscribeButton}
                onPress={() => handlePayment(100)}
              >
                <Text style={styles.subscribeText}>Upgrade to Premium</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {status === 'active' && (
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Manage Subscription</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.renewButton}
              onPress={() => handlePayment(100)}
            >
              <Text style={styles.renewText}>🔄 Renew Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>Cancel Subscription</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingDescription}>Receive instant security alerts</Text>
          </View>
          <TouchableOpacity 
            style={[styles.toggleButton, notificationsEnabled && styles.toggleButtonActive]}
            onPress={toggleNotifications}
          >
            <Text style={styles.toggleText}>
              {notificationsEnabled ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>Payment History</Text>
        {paymentHistory.map((payment) => (
          <View key={payment.id} style={styles.paymentItem}>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentDate}>{payment.date}</Text>
              <Text style={styles.paymentAmount}>{payment.amount}</Text>
            </View>
            <View style={[styles.statusBadge, styles.paymentStatus]}>
              <Text style={styles.statusText}>{payment.status}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 Subscription Info</Text>
        <Text style={styles.infoText}>
          • Auto-renews monthly{'\n'}
          • Cancel anytime{'\n'}
          • 24/7 premium support{'\n'}
          • Full refund if unsatisfied{'\n'}
          • Secure payment processing{'\n'}
          • Instant activation
        </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#e8f5e8',
  },
  cancelledBadge: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  plansSection: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  planCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activePlanCard: {
    borderWidth: 2,
    borderColor: '#61a3d2',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  planIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  planPrice: {
    fontSize: 16,
    color: '#61a3d2',
    fontWeight: '500',
  },
  currentPlanBadge: {
    backgroundColor: '#61a3d2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  currentPlanText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  featuresList: {
    marginBottom: 15,
  },
  featureItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    lineHeight: 20,
  },
  subscribeButton: {
    backgroundColor: '#61a3d2',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  subscribeText: {
    color: '#fff',
    fontWeight: '500',
  },
  actionsSection: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  renewButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  renewText: {
    color: '#fff',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  cancelText: {
    color: '#d32f2f',
    fontWeight: '500',
  },
  settingsSection: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  settingItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  toggleButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  toggleButtonActive: {
    backgroundColor: '#61a3d2',
  },
  toggleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  paymentSection: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  paymentItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#61a3d2',
  },
  paymentStatus: {
    backgroundColor: '#e8f5e8',
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },
});

export default SubscriptionScreen;