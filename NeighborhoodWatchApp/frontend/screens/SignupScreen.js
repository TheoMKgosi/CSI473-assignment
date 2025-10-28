import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const SignupScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', phone: '', address: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    console.log('Signup button pressed'); // Debug log
    
    for (const field in form) {
      if (!form[field].trim()) {
        Alert.alert('Error', `Please fill in ${field.replace('_', ' ')}`);
        return;
      }
    }

    setIsLoading(true);

    try {
      console.log('Attempting signup...'); // Debug log
      const response = await axios.post(`${API_URL}/signup/`, form);
      
      console.log('Signup response:', response.data); // Debug log

      if (response.data.success) {
        Alert.alert(
          'Success',
          response.data.message || 'Account created successfully! Awaiting admin approval.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
    } catch (error) {
      console.log('Signup error details:', error); // Debug log
      
      // If backend is not reachable, use mock signup for demo
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        Alert.alert(
          'Demo Mode', 
          'Account created in demo mode! (Backend not connected)',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else if (error.response?.data?.errors) {
        Alert.alert('Signup Failed', error.response.data.errors);
      } else {
        Alert.alert('Error', 'Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
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
                editable={!isLoading}
              />
            ))}

            <View style={styles.termsContainer}>
              <TouchableOpacity style={styles.checkbox}>
                <Text style={styles.checkboxText}>☑</Text>
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginBold}>Sign In</Text>
              </Text>
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center',
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxText: {
    fontSize: 16,
    color: '#61a3d2',
  },
  termsText: {
    fontSize: 12,
    color: '#666',
  },
  termsLink: {
    color: '#61a3d2',
    fontWeight: '500',
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#61a3d2',
    borderRadius: 6,
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginTop: 5,
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
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 12,
  },
  loginBold: {
    color: '#61a3d2',
    fontWeight: '600',
  },
});

export default SignupScreen;