import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './api';

const SubscriptionScreen = () => {
  const [status, setStatus] = useState('none');
  const [plan, setPlan] = useState('basic');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/members/subscription/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.has_subscription) {
          setSubscriptionData(data.subscription);
          setStatus(data.subscription.status);
          setPlan(data.subscription.type);
        } else {
          setStatus('none');
          setPlan('basic');
        }
      } else {
        console.error('Failed to load subscription:', data);
        Alert.alert('Error', 'Failed to load subscription status');
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      Alert.alert('Error', 'Failed to load subscription status');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (amount, planName) => {
    setShowPaymentModal(false);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/members/pay-subscription/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription_type: planName.toLowerCase(),
          amount: amount,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Payment Successful! 🎉',
          `Your ${planName} subscription has been activated.`,
          [
            {
              text: 'Great!',
              onPress: () => {
                loadSubscriptionStatus(); // Reload subscription status
                Alert.alert('📢 Notification', 'Your subscription has been activated! Enjoy premium features.');
              }
            }
          ]
        );
      } else {
        Alert.alert('Payment Failed', data.errors || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    }
  };

  const handleCancel = async () => {
    setShowCancelModal(false);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/members/cancel-subscription/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Subscription Cancelled',
          'Your premium subscription will remain active until the end of your billing period.',
          [
            {
              text: 'OK',
              onPress: () => {
                loadSubscriptionStatus(); // Reload subscription status
                Alert.alert('📢 Notification', 'Your subscription has been cancelled. You will lose access to premium features after your billing period ends.');
              }
            }
          ]
        );
      } else {
        Alert.alert('Cancellation Failed', data.errors || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      Alert.alert('Error', 'Failed to cancel subscription. Please try again.');
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    Alert.alert(
      'Notifications', 
      `Push notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`,
      [{ text: 'OK' }]
    );
  };

  const showPaymentDialog = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const showCancelDialog = () => {
    setShowCancelModal(true);
  };

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      features: ['Basic security alerts', 'Community forum access', 'Limited patrol statistics', 'Email support', 'Basic incident reporting'],
      icon: '🔓',
      active: plan === 'basic',
      priceValue: 0
    },
    {
      name: 'Premium',
      price: 'P100/month',
      features: ['Real-time emergency alerts', 'Full patrol statistics & analytics', 'Priority 24/7 support', 'Emergency SOS button', 'Advanced location tracking', '24/7 security monitoring', 'Push notifications'],
      icon: '⭐',
      active: plan === 'premium',
      priceValue: 100
    },
  ];

  // Update plan active status based on current subscription
  plans.forEach(p => {
    p.active = p.name.toLowerCase() === plan && status === 'active';
  });

  const paymentHistory = [
    { id: 1, date: 'Oct 28, 2024', amount: 'P100', status: 'Completed', type: 'Premium Renewal' },
    { id: 2, date: 'Sep 28, 2024', amount: 'P100', status: 'Completed', type: 'Premium Renewal' },
    { id: 3, date: 'Aug 28, 2024', amount: 'P100', status: 'Completed', type: 'Premium Renewal' },
  ];

  const PaymentModal = () => (
    <Modal
      visible={showPaymentModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowPaymentModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm Payment</Text>
          <Text style={styles.modalSubtitle}>
            You are about to subscribe to {selectedPlan?.name} Plan
          </Text>
          
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentAmount}>{selectedPlan?.price}</Text>
            <Text style={styles.paymentDescription}>Monthly subscription</Text>
          </View>

          <View style={styles.featurePreview}>
            <Text style={styles.featurePreviewTitle}>You'll get:</Text>
            {selectedPlan?.features.slice(0, 3).map((feature, index) => (
              <Text key={index} style={styles.featurePreviewItem}>✓ {feature}</Text>
            ))}
            <Text style={styles.featurePreviewMore}>...and {selectedPlan?.features.length - 3} more features</Text>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowPaymentModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalConfirmButton}
              onPress={() => handlePayment(selectedPlan?.priceValue, selectedPlan?.name)}
            >
              <Text style={styles.modalConfirmText}>Confirm Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const CancelModal = () => (
    <Modal
      visible={showCancelModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCancelModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cancel Subscription?</Text>
          <Text style={styles.modalSubtitle}>
            Are you sure you want to cancel your Premium subscription?
          </Text>
          
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>You'll lose access to:</Text>
            <Text style={styles.warningItem}>• Real-time emergency alerts</Text>
            <Text style={styles.warningItem}>• Advanced security features</Text>
            <Text style={styles.warningItem}>• Priority 24/7 support</Text>
            <Text style={styles.warningItem}>• Full patrol statistics</Text>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowCancelModal(false)}
            >
              <Text style={styles.modalCancelText}>Keep Subscription</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalConfirmCancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.modalConfirmText}>Cancel Anyway</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#61a3d2" />
        <Text style={styles.loadingText}>Loading subscription...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Subscription Management</Text>
        <View style={[styles.statusBadge, status === 'active' ? styles.activeBadge : status === 'cancelled' ? styles.cancelledBadge : styles.inactiveBadge]}>
          <Text style={styles.statusText}>
            {status === 'active' ? '🟢 ACTIVE' : status === 'cancelled' ? '🔴 CANCELLED' : '⚪ NO SUBSCRIPTION'}
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
                onPress={() => showPaymentDialog(planItem)}
              >
                <Text style={styles.subscribeText}>Upgrade to Premium</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {status === 'active' && plan === 'premium' && subscriptionData && (
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Manage Subscription</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.renewButton}
              onPress={() => showPaymentDialog(plans[1])}
            >
              <Text style={styles.renewText}>🔄 Renew Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={showCancelDialog}
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
            <Text style={styles.settingDescription}>Receive instant security alerts and updates</Text>
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
              <Text style={styles.paymentType}>{payment.type}</Text>
            </View>
            <View style={styles.paymentRight}>
              <Text style={styles.paymentAmount}>{payment.amount}</Text>
              <View style={[styles.statusBadge, styles.paymentStatus]}>
                <Text style={styles.statusText}>{payment.status}</Text>
              </View>
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

      <PaymentModal />
      <CancelModal />
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
  inactiveBadge: {
    backgroundColor: '#f5f5f5',
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
  paymentType: {
    fontSize: 12,
    color: '#666',
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#61a3d2',
    marginBottom: 5,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  paymentDetails: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#61a3d2',
    marginBottom: 5,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#666',
  },
  featurePreview: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  featurePreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  featurePreviewItem: {
    fontSize: 12,
    color: '#2e7d32',
    marginBottom: 4,
  },
  featurePreviewMore: {
    fontSize: 11,
    color: '#2e7d32',
    fontStyle: 'italic',
    marginTop: 5,
  },
  warningBox: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 8,
  },
  warningItem: {
    fontSize: 12,
    color: '#d32f2f',
    marginBottom: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalCancelText: {
    color: '#666',
    fontWeight: '500',
  },
  modalConfirmButton: {
    backgroundColor: '#61a3d2',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  modalConfirmCancelButton: {
    backgroundColor: '#d32f2f',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default SubscriptionScreen;