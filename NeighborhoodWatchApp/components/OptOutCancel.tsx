import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import axios from 'axios';

const OptOutCancel = () => {
  const handleCancel = async () => {
    try {
      await axios.post('http://your-django-api/cancel-subscription/');
      Alert.alert('Success', 'Subscription canceled');
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Subscription</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.status}>Status</Text>
        <Text style={styles.active}>Active</Text>
        <Image source={require('../assets/tick-icon.png')} style={styles.tick} />
      </View>
      <View style={styles.cancelContainer}>
        <Text style={styles.cancelText}>Cancel Subscription</Text>
        <Text style={styles.cancelNow}>Cancel Now?</Text>
      </View>
      <Button title="Cancel Subscription" onPress={handleCancel} color="#FF0004" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  title: { fontSize: 28, color: '#000', fontFamily: 'Inter', textAlign: 'center', marginVertical: 10 },
  statusContainer: { borderWidth: 1, borderColor: '#61A3D2', borderRadius: 5, padding: 10, marginVertical: 10, alignItems: 'center' },
  status: { fontSize: 24, color: '#000', fontFamily: 'Inter' },
  active: { fontSize: 24, color: '#000', fontFamily: 'Inter' },
  tick: { width: 35, height: 35 },
  cancelContainer: { borderWidth: 1, borderColor: '#61A3D2', borderRadius: 5, padding: 10, marginVertical: 10, alignItems: 'center' },
  cancelText: { fontSize: 24, color: '#000', fontFamily: 'Inter' },
  cancelNow: { fontSize: 24, color: '#FF0004', fontFamily: 'Inter' },
});

export default OptOutCancel;