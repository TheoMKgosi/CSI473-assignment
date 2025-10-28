import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    badgeNumber: '',
  });

  const handleSignUp = () => {
    const { firstName, lastName, email, password, confirmPassword, badgeNumber } = formData;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword || !badgeNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    // Simulate signup - in real app, this would call your backend
    Alert.alert('Success', 'Account created successfully! Please login.');
    navigation.navigate('Login');
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Account</Text>
        
        <View style={styles.nameRow}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(text) => updateFormData('firstName', text)}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(text) => updateFormData('lastName', text)}
          />
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Badge Number"
          value={formData.badgeNumber}
          onChangeText={(text) => updateFormData('badgeNumber', text)}
          keyboardType="numeric"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => updateFormData('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => updateFormData('password', text)}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(text) => updateFormData('confirmPassword', text)}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Create Account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  halfInput: {
    width: '48%',
  },
  signUpButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default SignUpScreen;
