import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const API_URL = 'https://super-palm-tree-69499prjx6rp24xg7-8000.app.github.dev/api';

const SignupScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    full_name: '', 
    email: '', 
    password: '', 
    phone: '', 
    address: ''
  });

  const handleSignup = async () => {
    try {
      await axios.post(`${API_URL}/signup/`, form);
      Alert.alert('Success', 'Account created! Awaiting admin approval.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.errors || 'Signup failed');
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Blue Shield Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.shieldIcon}>🛡️</Text>
        <Text style={styles.appName}>Join Our Community</Text>
        <Text style={styles.appTagline}>Neighborhood Watch</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to enhance community safety</Text>

        {['full_name', 'email', 'password', 'phone', 'address'].map((field) => (
          <TextInput
            key={field}
            style={styles.input}
            placeholder={field.replace('_', ' ').toUpperCase()}
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

        <View style={styles.termsContainer}>
          <TouchableOpacity style={styles.checkbox}>
            <Text style={styles.checkboxText}>☐</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  shieldIcon: {
    fontSize: 70,
    color: '#61a3d2', // Blue color for the shield
    marginBottom: 12,
    textShadowColor: 'rgba(97, 163, 210, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
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
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 5,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 18,
    color: '#61a3d2',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  termsLink: {
    color: '#61a3d2',
    fontWeight: '500',
  },
  button: { 
    width: '100%', 
    padding: 16, 
    backgroundColor: '#61a3d2', 
    borderRadius: 12, 
    marginTop: 10, 
    alignItems: 'center',
    shadowColor: '#61a3d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '600',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginBold: {
    color: '#61a3d2',
    fontWeight: '600',
  },
});

export default SignupScreen;