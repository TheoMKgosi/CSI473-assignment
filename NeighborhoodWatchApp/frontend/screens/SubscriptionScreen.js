import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const SubscriptionScreen = () => {
  const [status, setStatus] = useState('active'); // active, cancelled
  const [plan, setPlan] = useState('premium');

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
            Alert.alert('Cancelled', 'Your subscription has been cancelled.');
          },
        },
      ]
    );
  };

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      features: ['Basic alerts', 'Community forum access', 'Limited patrol stats'],
      icon: '🔓',
      active: false
    },
    {
      name: 'Premium',
      price: 'P100/month',
      features: ['Real-time alerts', 'Full patrol statistics', 'Priority support', 'Emergency SOS'],
      icon: '⭐',
      active: true
    },
  ];

  return (
    <View style={styles.container}>
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
        {plans.map((plan, index) => (
          <View 
            key={index} 
            style={[
              styles.planCard, 
              plan.active && styles.activePlanCard
            ]}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planIcon}>{plan.icon}</Text>
              <View>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
              </View>
              {plan.active && (
                <View style={styles.currentPlanBadge}>
                  <Text style={styles.currentPlanText}>Current Plan</Text>
                </View>
              )}
            </View>
            
            <View style={styles.featuresList}>
              {plan.features.map((feature, featureIndex) => (
                <Text key={featureIndex} style={styles.featureItem}>
                  ✓ {feature}
                </Text>
              ))}
            </View>

            {!plan.active && plan.name === 'Premium' && status === 'cancelled' && (
              <TouchableOpacity 
                style={styles.subscribeButton}
                onPress={() => handlePayment(100)}
              >
                <Text style={styles.subscribeText}>Subscribe Now</Text>
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

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 Subscription Info</Text>
        <Text style={styles.infoText}>
          • Auto-renews monthly{'\n'}
          • Cancel anytime{'\n'}
          • 24/7 premium support{'\n'}
          • Full refund if unsatisfied
        </Text>
      </View>
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
    marginLeft: 'auto',
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
  infoCard: {
    backgroundColor: '#e3f2fd',
    padding: 15,
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