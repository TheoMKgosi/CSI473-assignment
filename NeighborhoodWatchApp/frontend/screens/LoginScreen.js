import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login/`, {
        email,
        password
      });

      if (response.data.success) {
        Alert.alert('Success', 'Logged in successfully!');
        navigation.navigate('Home', {
          token: response.data.token,
          user: response.data.user
        });
      } else {
        Alert.alert('Login Failed', response.data.errors || 'Invalid credentials');
      }
    } catch (error) {
      console.log('Login error:', error);
      
      if (error.response?.status === 403) {
        Alert.alert('Approval Required', 'Your account is pending admin approval.');
      } else if (error.response?.data?.errors) {
        Alert.alert('Login Failed', error.response.data.errors);
      } else {
        Alert.alert('Error', 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.shieldIcon}>🛡️</Text>
          <Text style={styles.appName}>Neighborhood Watch</Text>
          <Text style={styles.appTagline}>Community Security</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

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
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.signupText}>
              New to Neighborhood Watch? <Text style={styles.signupBold}>Sign Up</Text>
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
    marginBottom: 25,
    textAlign: 'center',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: 5,
  },
  forgotText: {
    color: '#61a3d2',
    fontSize: 12,
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#61a3d2',
    borderRadius: 8,
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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