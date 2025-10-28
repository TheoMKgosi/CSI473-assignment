import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'https://super-palm-tree-69499prjx6rp24xg7-8000.app.github.dev';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('API URL:', `${API_BASE_URL}/api/login/`);
    console.log('Email:', email);
    
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Sending request to backend...');
      
      const response = await axios.post(`${API_BASE_URL}/api/login/`, {
        email,
        password
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('✅ Backend response:', response.data);

      if (response.data.success) {
        Alert.alert('Success', 'Logged in successfully with real backend!');
        navigation.navigate('Home', {
          token: response.data.token,
          user: response.data.user
        });
      } else {
        Alert.alert('Login Failed', response.data.errors || 'Invalid credentials');
      }
    } catch (error) {
      console.log('❌ Login error details:', {
        code: error.code,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.code === 'ERR_NETWORK') {
        Alert.alert(
          'Network Error', 
          `Cannot connect to: ${API_BASE_URL}\n\nPlease ensure:\n1. Backend is running on port 8000\n2. CORS is configured\n3. Ports are properly forwarded`,
          [{ text: 'OK' }]
        );
      } else if (error.response?.status === 403) {
        Alert.alert('Approval Required', 'Your account is pending admin approval.');
      } else if (error.response?.data?.errors) {
        Alert.alert('Login Failed', error.response.data.errors);
      } else {
        Alert.alert('Error', `Login failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Test with a pre-approved user
  const testWithRealUser = () => {
    setEmail('demo1@neighborhood.com');
    setPassword('demo123');
    Alert.alert(
      'Test Credentials Loaded',
      'Using pre-approved demo account. Click Login to test real backend connection.'
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.shieldIcon}>🛡️</Text>
          <Text style={styles.appName}>Neighborhood Watch</Text>
          <Text style={styles.appTagline}>Real Backend Test</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.title}>Backend Login Test</Text>
          <Text style={styles.subtitle}>Testing real Django backend</Text>

          <Text style={styles.apiUrl}>Backend: {API_BASE_URL}</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Testing Real Login...' : 'Test Real Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.testButton}
            onPress={testWithRealUser}
          >
            <Text style={styles.testButtonText}>Load Test User</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.signupText}>
              Test Signup? <Text style={styles.signupBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    maxHeight: 600,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  shieldIcon: {
    fontSize: 60,
    color: '#61a3d2',
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: '#61a3d2',
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  apiUrl: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    fontSize: 14,
    height: 44,
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#61a3d2',
    borderRadius: 8,
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  testButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  testButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  signupLink: {
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 12,
  },
  signupBold: {
    color: '#61a3d2',
    fontWeight: '600',
  },
});

export default LoginScreen;