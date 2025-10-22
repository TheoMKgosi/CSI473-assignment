import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://your-django-api/login/', { email, password });
      if (response.data.success) navigation.navigate('Dashboard');
      else Alert.alert('Error', 'Invalid credentials');
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.logoContainer}>
        <Image source={{ uri: 'path-to-smart-home-shield' }} style={styles.logo} />
      </View>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Text style={styles.forgot} onPress={() => navigation.navigate('ForgotPassword')}>Forgot password?</Text>
      <Button title="Login" onPress={handleLogin} color="#61A3D2" />
      <Text style={styles.signup} onPress={() => navigation.navigate('SignUp')}>New? Sign Up</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  title: { fontSize: 32, color: '#000' },
  logoContainer: { alignItems: 'center' },
  logo: { width: 104, height: 118 },
  input: { backgroundColor: '#61A3D242', height: 52, marginVertical: 10, padding: 10 },
  forgot: { color: '#61A3D2', fontSize: 12 },
  signup: { color: '#61A3D2', fontSize: 14 },
});

export default Login;