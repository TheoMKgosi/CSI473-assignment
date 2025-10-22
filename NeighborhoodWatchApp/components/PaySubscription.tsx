import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
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
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        placeholderTextColor="#000"
        keyboardType="numeric"
      />
      <Button title="Pay Now" onPress={handlePay} color="#61A3D2" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, color: '#000', fontFamily: 'Inter', textAlign: 'center', marginVertical: 10 },
  input: { backgroundColor: '#61A3D242', height: 50, padding: 10, marginVertical: 10, fontSize: 16, color: '#000', fontFamily: 'Inter' },
});

export default PaySubscription;