import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';

const SubscriptionScreen = ({ route }) => {
  const { token } = route.params || {};
  const [amount, setAmount] = useState('');

  const handlePaySubscription = async () => {
    if (!amount.trim()) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }
    try {
      const response = await axios.post(
        'https://super-palm-tree-69499prjx6rp24xg7.github.dev:8000/api/pay-subscription/',
        { payment_date: new Date().toISOString().split('T')[0], amount },
        { headers: { Authorization: `Token ${token}` } }
      );
      Alert.alert('Success', 'Subscription payment processed');
      setAmount('');
    } catch (error) {
      Alert.alert('Error', 'Failed to process payment');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await axios.post(
        'https://super-palm-tree-69499prjx6rp24xg7.github.dev:8000/api/cancel-subscription/',
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      Alert.alert('Success', 'Subscription cancelled');
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel subscription');
    }
  };

  return (
    <View style={styles.subscription}>
      <Text style={styles.subscriptionTitle}>Manage Subscription</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter payment amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.rectangle19} onPress={handlePaySubscription}>
        <Image source={require('../../assets/money-icon.png')} style={styles.carbonMoney} />
        <Text style={styles.pay}>Pay</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.rectangle20} onPress={handleCancelSubscription}>
        <View style={styles.iconoirTools}>
          <Image source={require('../../assets/tools-icon.png')} style={styles.group} />
        </View>
        <Text style={styles.manageSubscription}>Cancel Subscription</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  subscription: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  subscriptionTitle: {
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '400',
    color: '#000',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#61a3d2',
    borderRadius: 10,
    backgroundColor: '#fff',
    fontFamily: 'Inter',
    fontSize: 14,
  },
  rectangle19: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#61a3d2',
    borderRadius: 10,
    padding: 10,
    width: 129,
    height: 104,
    marginVertical: 10,
  },
  carbonMoney: {
    width: 50,
    height: 50,
  },
  pay: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    marginLeft: 10,
  },
  rectangle20: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#61a3d2',
    borderRadius: 10,
    padding: 10,
    width: 129,
    height: 104,
    marginVertical: 10,
  },
  iconoirTools: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    padding: 5,
  },
  group: {
    width: 40,
    height: 40,
  },
  manageSubscription: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    marginLeft: 10,
  },
});

export default SubscriptionScreen;