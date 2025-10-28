import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

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

    // Simulate API call delay
    setTimeout(() => {
      // Mock successful login
      Alert.alert('Success', 'Mock login successful!');
      navigation.navigate('Home', {
        token: 'mock-token-12345',
        user: { 
          email: email, 
          full_name: 'Demo User',
          is_approved: true
        }
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.shieldIcon}>🛡️</Text>
        <Text style={styles.appName}>Neighborhood Watch</Text>
        <Text style={styles.appTagline}>Community Security</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

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

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

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
          disabled={isLoading}
        >
          <Text style={styles.signupText}>
            New to Neighborhood Watch? <Text style={styles.signupBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
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
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  shieldIcon: {
    fontSize: 80,
    color: '#61a3d2',
    marginBottom: 15,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  appTagline: {
    fontSize: 16,
    color: '#61a3d2',
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: { 
    width: '100%', 
    padding: 16, 
    marginVertical: 8, 
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    borderRadius: 12,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#61a3d2',
    fontSize: 14,
  },
  button: { 
    width: '100%', 
    padding: 16, 
    backgroundColor: '#61a3d2', 
    borderRadius: 12, 
    marginTop: 10, 
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '600',
    fontSize: 16,
  },
  signupLink: {
    marginTop: 25,
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupBold: {
    color: '#61a3d2',
    fontWeight: '600',
  },
});

export default LoginScreen;