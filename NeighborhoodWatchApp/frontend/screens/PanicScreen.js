import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const PanicScreen = ({ route }) => {
  const { token } = route.params || {};

  const handlePanic = async () => {
    try {
      const response = await axios.post(
        'https://super-palm-tree-69499prjx6rp24xg7.github.dev:8000/api/panic/',
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      Alert.alert('Success', 'Emergency alert triggered!');
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
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '400',
    color: '#000',
    marginBottom: 20,
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
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
  },
  infoText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
});

export default PanicScreen;