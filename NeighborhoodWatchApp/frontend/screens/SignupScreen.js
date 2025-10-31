import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from './api';
import { showAlert, showError, showSuccess } from '../utils/alert';

const SignupScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', phone: '', address: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    for (const field in form) {
      if (!form[field].trim()) {
        showError(`Please fill in ${field.replace('_', ' ')}`);
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/members/signup/`, form);
      
      if (response.data.success) {
        showAlert(
          'Success! 🎉',
          'Account created successfully! Please login with your credentials.',
          [
            {
              text: 'Go to Login',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } else {
        showAlert('Signup Failed', response.data.errors || 'Please try again.');
      }
    } catch (error) {
      console.log('Signup error:', error);
      
      if (error.response?.data?.errors) {
        showAlert('Signup Failed', error.response.data.errors);
      } else if (error.code === 'ERR_NETWORK') {
        // Network error - redirect to login
        showAlert(
          'Connection Issue',
          'Cannot reach server. Please try logging in with a demo account.',
          [
            {
              text: 'Go to Login',
              onPress: () => navigation.navigate('Login')
            },
            {
              text: 'Try Again',
              style: 'cancel'
            }
          ]
        );
      } else {
        showError('Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openAdminPanel = () => {
    Linking.openURL('https://super-palm-tree-69499prjx6rp24xg7-8000.app.github.dev/admin')
      .catch(err => showError('Cannot open admin panel'));
  };

  const useDemoAccount = (accountNumber) => {
    const demos = [
      { email: 'demo1@neighborhood.com', password: 'demo123' },
      { email: 'demo2@neighborhood.com', password: 'demo123' },
      { email: 'demo3@neighborhood.com', password: 'demo123' }
    ];
    
    const demo = demos[accountNumber - 1];
    showAlert(
      'Demo Account',
      `Use this account to login:\n\nEmail: ${demo.email}\nPassword: ${demo.password}`,
      [{ text: 'Go to Login', onPress: () => navigation.navigate('Login') }]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.shieldIcon}>🛡️</Text>
            <Text style={styles.appName}>Join Our Community</Text>
            <Text style={styles.appTagline}>Neighborhood Watch</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to enhance community safety</Text>

            {['full_name', 'email', 'password', 'phone', 'address'].map((field) => (
              <TextInput
                key={field}
                style={styles.input}
                placeholder={field.replace('_', ' ').toUpperCase()}
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                value={form[field]}
                onChangeText={(text) => setForm({ ...form, [field]: text })}
                secureTextEntry={field === 'password'}
                keyboardType={
                  field === 'email' ? 'email-address' :
                  field === 'phone' ? 'phone-pad' :
                  'default'
                }
                autoCapitalize={field === 'email' ? 'none' : 'words'}
              />
            ))}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Demo Accounts Section */}
            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>Quick Demo Access</Text>
              <Text style={styles.demoSubtitle}>Pre-approved accounts for immediate testing</Text>
              
              <View style={styles.demoButtons}>
                <TouchableOpacity 
                  style={styles.demoButton}
                  onPress={() => useDemoAccount(1)}
                >
                  <Text style={styles.demoButtonText}>Demo Account 1</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.demoButton}
                  onPress={() => useDemoAccount(2)}
                >
                  <Text style={styles.demoButtonText}>Demo Account 2</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.demoButton}
                  onPress={() => useDemoAccount(3)}
                >
                  <Text style={styles.demoButtonText}>Demo Account 3</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.adminLink}
              onPress={openAdminPanel}
            >
              <Text style={styles.adminText}>Admin Panel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    minHeight: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
  },
  shieldIcon: {
    fontSize: 55,
    color: '#61a3d2',
    marginBottom: 8,
  },
  appName: {
    fontSize: 22,
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
    marginBottom: 30,
    marginTop: 20,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    backgroundColor: '#fafafa',
    fontSize: 14,
    height: 40,
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#61a3d2',
    borderRadius: 6,
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  demoSection: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  demoSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demoButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  demoButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  loginLink: {
    alignItems: 'center',
    marginBottom: 10,
  },
  loginText: {
    color: '#666',
    fontSize: 12,
  },
  loginBold: {
    color: '#61a3d2',
    fontWeight: '600',
  },
  adminLink: {
    alignItems: 'center',
  },
  adminText: {
    color: '#6c757d',
    fontSize: 10,
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;