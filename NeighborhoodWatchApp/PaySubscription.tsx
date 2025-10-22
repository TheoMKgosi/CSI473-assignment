import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const PaySubscription = () => {
  const [amount, setAmount] = useState('');

  const handlePay = async () => {
    try {
      const response = await axios.post('http://your-django-api/pay-subscription/', { amount });
      if (response.data.success) Alert.alert('Success', 'Payment processed');
      else Alert.alert('Error', 'Payment failed');
    } catch (error) {
      Alert.alert('Error', 'Server error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pay Subscription</Text>
      {/* Add payment gateway integration like Stripe or local options */}
      <TextInput style={styles.input} placeholder="Amount" value={amount} onChangeText={setAmount} />
      <Button title="Pay Now" onPress={handlePay} color="#61A3D2" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, color: '#000' },
  input: { backgroundColor: '#61A3D242', height: 50, padding: 10 },
});

export default PaySubscription;