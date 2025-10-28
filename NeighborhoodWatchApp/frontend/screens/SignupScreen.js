import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

const SignupScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', phone: '', address: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    // Validate all fields
    for (const field in form) {
      if (!form[field].trim()) {
        Alert.alert('Error', `Please fill in ${field.replace('_', ' ')}`);
        return;
      }
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      Alert.alert(
        'Success',
        'Account created successfully! Awaiting admin approval.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
      setIsLoading(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Compact Header */}
      <View style={styles.logoContainer}>
        <Text style={styles.shieldIcon}>🛡️</Text>
        <Text style={styles.appName}>Join Neighborhood Watch</Text>
      </View>

      {/* Compact Form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>

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
            editable={!isLoading}
          />
        ))}

        {/* Compact Terms */}
        <View style={styles.termsContainer}>
          <TouchableOpacity style={styles.checkbox}>
            <Text style={styles.checkboxText}>☑</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I agree to Terms & Conditions
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
    marginTop: 20,
    marginBottom: 20,
  },
  shieldIcon: {
    fontSize: 50,
    color: '#61a3d2',
    marginBottom: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
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
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#61a3d2',
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
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
    marginTop: 15,
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