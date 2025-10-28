import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Simulate login - in real app, this would call your backend
    try {
      // store a demo token so RootLayout picks up authenticated state
      await AsyncStorage.setItem('token', 'demo-token');
      Alert.alert('Success', 'Logged in successfully!');
      // navigate to tabs index
      navigation.replace('(tabs)/index');
    } catch (e) {
      Alert.alert('Error', 'Failed to save session');
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
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.signUpLink}
          onPress={() => router.replace('/(auth)/signup')}
        >
          <Text style={styles.signUpText}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.demoButton} onPress={async () => {
          try {
            await AsyncStorage.setItem('token', 'demo-token');
            router.replace('/(tabs)/index');
          } catch (e) {
            Alert.alert('Error', 'Failed to use demo account');
          }
        }}>
          <Text style={styles.demoButtonText}>Use Demo Account</Text>
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
});

export default LoginScreen;
