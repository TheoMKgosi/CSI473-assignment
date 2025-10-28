import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function SubscriptionScreen() {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('active');

  const pay = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return Alert.alert('Error', 'Enter a valid amount');
    Alert.alert('Payment Success', `$${num.toFixed(2)} processed`);
    setAmount('');
  };

  const cancel = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure?',
      [{ text: 'No' }, { text: 'Yes', style: 'destructive', onPress: () => setStatus('cancelled') }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscription</Text>

      {status === 'active' ? (
        <>
          <Text style={styles.active}>Active</Text>

          <Text style={styles.label}>Amount (USD):</Text>
          <Text Snapshot style={styles.input} placeholder="e.g. 50" value={amount} onChangeText={setAmount} keyboardType="numeric" />

          <TouchableOpacity style={styles.payBtn} onPress={pay}>
            <Text style={styles.payText}>Pay Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={cancel}>
            <Text style={styles.cancelText}>Cancel Subscription</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.cancelled}>Subscription Cancelled</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 26, textAlign: 'center', marginBottom: 20 },
  active: { fontSize: 18, color: 'green', textAlign: 'center', marginBottom: 30 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#61a3d2', borderRadius: 10, padding: 12, marginBottom: 20 },
  payBtn: { backgroundColor: '#61a3d2', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  payText: { color: '#fff' },
  cancelBtn: { alignItems: 'center' },
  cancelText: { color: '#d32f2f' },
  cancelled: { fontSize: 20, color: '#d32f2f', textAlign: 'center' },
});