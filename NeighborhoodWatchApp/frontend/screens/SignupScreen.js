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
    <ScrollView contentContainerStyle={styles.scrollContent}>
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
            editable={!isLoading}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  shieldIcon: {
    fontSize: 70,
    color: '#61a3d2',
    marginBottom: 12,
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
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
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