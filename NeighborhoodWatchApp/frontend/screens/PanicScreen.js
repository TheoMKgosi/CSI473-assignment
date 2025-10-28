import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

export default function PanicScreen() {
  const [loading, setLoading] = useState(false);

  const trigger = async () => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Location is required for emergency alerts.');
      setLoading(false);
      return;
    }

    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = loc.coords;

      // Mock backend call – replace with real axios later
      console.log('Panic sent:', { latitude, longitude });

      Alert.alert(
        'Emergency Sent',
        `Location shared:\nLat ${latitude.toFixed(6)}\nLng ${longitude.toFixed(6)}`
      );
    } catch (e) {
      Alert.alert('Error', 'Could not get location.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Alert</Text>
      <Text style={styles.desc}>
        Tap below to instantly alert responders with your **real-time GPS location**.
      </Text>

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={trigger}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>TRIGGER EMERGENCY</Text>}
      </TouchableOpacity>

      <Text style={styles.footer}>Your coordinates are sent securely.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, color: '#d32f2f', marginBottom: 20 },
  desc: { textAlign: 'center', fontSize: 16, marginBottom: 40, paddingHorizontal: 20 },
  btn: { backgroundColor: '#d32f2f', paddingVertical: 25, paddingHorizontal: 40, borderRadius: 50, marginVertical: 30, minWidth: 220, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#999' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { textAlign: 'center', color: '#888', fontSize: 12, marginTop: 20 },
});