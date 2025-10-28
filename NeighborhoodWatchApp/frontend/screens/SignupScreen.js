import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

export default function SignupScreen({ navigation }) {
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', phone: '', address: '',
  });

  const handleSignup = () => {
    const filled = Object.values(form).every(v => v.trim());
    if (filled) {
      Alert.alert('Success', 'Signed up (mock) – awaiting admin approval');
      navigation.replace('Login');
    } else {
      Alert.alert('Error', 'All fields required');
    }
  };

  const update = (key, val) => setForm({ ...form, [key]: val });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {['full_name', 'email', 'password', 'phone', 'address'].map(f => (
        <TextInput
          key={f}
          style={styles.input}
          placeholder={f.replace('_', ' ').toUpperCase()}
          value={form[f]}
          onChangeText={t => update(f, t)}
          secureTextEntry={f === 'password'}
          keyboardType={f === 'email' ? 'email-address' : f === 'phone' ? 'phone-pad' : 'default'}
        />
      ))}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 20 },
  input: { width: '100%', padding: 12, marginVertical: 8, borderWidth: 1, borderColor: '#61a3d2', borderRadius: 10 },
  button: { width: '100%', padding: 15, backgroundColor: '#61a3d2', borderRadius: 10, marginTop: 10, alignItems: 'center' },
  buttonText: { color: '#fff' },
});