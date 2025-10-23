import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const PanicScreen = () => {
  const handlePanic = async () => {
    try {
      const response = await axios.post(
        'https://<your-codespace>.github.dev:8000/api/panic/',
        {},
        { headers: { Authorization: 'Token <your-token>' } }
      );
      if (response.data.success) {
        Alert.alert('Success', 'Emergency alert triggered!');
      } else {
        Alert.alert('Error', 'Failed to trigger alert');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to trigger alert');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panic Button</Text>
      <TouchableOpacity style={styles.panicButton} onPress={handlePanic}>
        <Text style={styles.panicButtonText}>TRIGGER EMERGENCY ALERT</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>
        Press the button above to send an emergency alert to the neighborhood watch team.
      </Text>
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
  panicButton: {
    width: '100%',
    padding: 20,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  panicButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default PanicScreen;