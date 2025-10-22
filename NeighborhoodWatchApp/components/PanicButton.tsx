import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SMS from 'expo-sms';

const PanicButton = () => {
  const triggerPanic = async () => {
    try {
      await axios.post('http://your-django-api/panic/', {});
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync(['+1234567890'], 'Emergency Alert from Neighborhood Watch!');
      }
      Alert.alert('Alert', 'Emergency alert sent');
    } catch (error) {
      Alert.alert('Error', 'Failed to send alert');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Panic Button" onPress={triggerPanic} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});

export default PanicButton;