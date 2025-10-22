import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
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
      <View style={styles.logoContainer}>
        <Image source={require('../assets/smart-home-shield.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} placeholderTextColor="#000" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#000" />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color="#61A3D2" />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signup}>New? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  logoContainer: { alignItems: 'center', marginVertical: 20 },
  logo: { width: 104, height: 118 },
  title: { fontSize: 32, color: '#000', fontFamily: 'Inter', textAlign: 'center' },
  inputContainer: { width: 337, alignSelf: 'center' },
  input: { backgroundColor: '#61A3D242', height: 52, marginVertical: 10, padding: 10, fontSize: 15, color: '#000', fontFamily: 'Inter' },
  forgot: { color: '#61A3D2', fontSize: 12, fontFamily: 'Inter', textAlign: 'center', marginVertical: 10 },
  buttonContainer: { width: 271, alignSelf: 'center', marginVertical: 10 },
  signup: { color: '#61A3D2', fontSize: 14, fontFamily: 'Inter', textAlign: 'center' },
});

export default Login;