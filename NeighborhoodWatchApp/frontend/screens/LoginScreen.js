import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Mock – any non-empty values are accepted
    if (email && password) {
      Alert.alert('Success', 'Logged in (mock)');
      navigation.replace('Home', { token: 'mock-token' });
    } else {
      Alert.alert('Error', 'Fill in both fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>No account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, marginBottom: 20 },
  input: { width: '100%', padding: 12, marginVertical: 8, borderWidth: 1, borderColor: '#61a3d2', borderRadius: 10 },
  button: { width: '100%', padding: 15, backgroundColor: '#61a3d2', borderRadius: 10, marginTop: 10, alignItems: 'center' },
  buttonText: { color: '#fff' },
  link: { color: '#61a3d2', marginTop: 15 },
});