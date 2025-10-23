import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const SubscriptionScreen = () => {
  const [amount, setAmount] = useState('');

  const handlePaySubscription = async () => {
    if (!amount.trim()) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }
    try {
      const response = await axios.post(
        'https://<your-codespace>.github.dev:8000/api/pay-subscription/',
        { amount },
        { headers: { Authorization: 'Token <your-token>' } }
      );
      if (response.data.success) {
        Alert.alert('Success', 'Subscription payment processed');
        setAmount('');
      } else {
        Alert.alert('Error', 'Failed to process payment');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process payment');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await axios.post(
        'https://<your-codespace>.github.dev:8000/api/cancel-subscription/',
        {},
        { headers: { Authorization: 'Token <your-token>' } }
      );
      if (response.data.success) {
        Alert.alert('Success', 'Subscription cancelled');
      } else {
        Alert.alert('Error', 'Failed to cancel subscription');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel subscription');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Subscription</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter payment amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handlePaySubscription}>
        <Text style={styles.buttonText}>Pay Subscription</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSubscription}>
        <Text style={styles.buttonText}>Cancel Subscription</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  cancelButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#dc3545',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubscriptionScreen;