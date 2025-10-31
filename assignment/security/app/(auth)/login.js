import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../utils/config';
import { showAlert, showError, showSuccess } from '../../utils/alert';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear any existing auth data when login screen loads
  useEffect(() => {
    const clearExistingAuth = async () => {
      try {
        await AsyncStorage.multiRemove(['token', 'userData', 'userRole', 'isDemo']);
        console.log('Cleared existing auth data');
      } catch (error) {
        console.error('Error clearing auth data:', error);
      }
    };

    clearExistingAuth();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      showError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/security/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.user));

      showSuccess(data.message || 'Logged in successfully!');
      router.replace('/(tabs)');
      
    } catch (error) {
      console.error('Login error:', error);
      showError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      await AsyncStorage.setItem('token', 'demo-token');
      await AsyncStorage.setItem('userRole', 'security');
      await AsyncStorage.setItem('isDemo', 'true');

      showAlert('Demo Mode', 'Using demo account');
      router.replace('/(tabs)');
    } catch (e) {
      showError('Failed to use demo account');
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
            Don&apos;t have an account? Sign Up
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.demoButton} 
          onPress={handleDemoLogin}
          disabled={isLoading}
        >
          <Text style={styles.demoButtonText}>Use Demo Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearAuthButton} onPress={async () => {
          try {
            await AsyncStorage.multiRemove(['token', 'userData', 'userRole', 'isDemo']);
            showAlert('Cleared', 'Authentication data cleared. Please login again.');
          } catch (e) {
            showError('Failed to clear auth data');
          }
        }}>
          <Text style={styles.clearAuthText}>Clear Auth Data</Text>
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
  clearAuthButton: {
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
  },
  clearAuthText: {
    color: '#FF3B30',
    fontSize: 14,
  },
});

export default LoginScreen;