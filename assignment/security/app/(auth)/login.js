import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Use your actual backend URL instead of localhost for mobile
      const API_URL = 'http://localhost:8000/api/security/login/'; // Change this to your actual backend URL
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.detail || 'Login failed');
      }

      // Store token from backend
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('userRole', 'security'); // Store user role if needed
      
      Alert.alert('Success', 'Logged in successfully!');
      router.replace('/(tabs)'); // Fixed navigation
      
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Failed to login';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.name === 'TypeError') {
        errorMessage = 'Network error: Please check your connection and server URL';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      await AsyncStorage.setItem('token', 'demo-token');
      await AsyncStorage.setItem('userRole', 'security');
      await AsyncStorage.setItem('isDemo', 'true');
      
      Alert.alert('Demo Mode', 'Using demo account');
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Error', 'Failed to use demo account');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Security Officer Login</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />
        
        <TouchableOpacity 
          style={[
            styles.loginButton, 
            isLoading && styles.loginButtonDisabled
          ]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.signUpLink}
          onPress={() => router.push('/(auth)/signup')}
          disabled={isLoading}
        >
          <Text style={styles.signUpText}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.demoButton} 
          onPress={handleDemoLogin}
          disabled={isLoading}
        >
          <Text style={styles.demoButtonText}>Use Demo Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: '#007AFF',
    fontSize: 16,
  },
  demoButton: {
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
  },
  demoButtonText: {
    color: '#666',
    fontSize: 14,
  },
});

export default LoginScreen;