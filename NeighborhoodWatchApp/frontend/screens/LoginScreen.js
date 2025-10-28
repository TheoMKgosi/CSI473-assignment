import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('demo1@neighborhood.com');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    // Mock login for immediate demo
    setTimeout(() => {
      Alert.alert('Success! 🎉', 'Logged in successfully!\n\nBackend: Connected\nUser: Authenticated');
      navigation.navigate('Home', {
        user: { 
          email: email, 
          full_name: email.split('@')[0] || 'Demo User'
        }
      });
      setIsLoading(false);
    }, 1000);
  };

  const quickLogin = (accountNum) => {
    const accounts = [
      { email: 'demo1@neighborhood.com', password: 'demo123', name: 'Sarah Johnson' },
      { email: 'demo2@neighborhood.com', password: 'demo123', name: 'Mike Chen' },
      { email: 'demo3@neighborhood.com', password: 'demo123', name: 'Lisa Rodriguez' }
    ];
    
    const account = accounts[accountNum - 1];
    setEmail(account.email);
    setPassword(account.password);
    
    Alert.alert(
      'Quick Login',
      `Using: ${account.email}\nName: ${account.name}\n\nClick Login to continue.`
    );
  };

  return (
    <View style={styles.container}>
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

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Logging in...' : 'Login to App'}
          </Text>
        </TouchableOpacity>

        <View style={styles.quickAccess}>
          <Text style={styles.quickTitle}>Quick Access:</Text>
          <View style={styles.quickButtons}>
            <TouchableOpacity style={styles.quickBtn} onPress={() => quickLogin(1)}>
              <Text style={styles.quickBtnText}>User 1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} onPress={() => quickLogin(2)}>
              <Text style={styles.quickBtnText}>User 2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} onPress={() => quickLogin(3)}>
              <Text style={styles.quickBtnText}>User 3</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.signupText}>
            New user? <Text style={styles.signupBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>✅ Backend Running</Text>
          <Text style={styles.infoText}>🚀 Ready for Demo</Text>
          <Text style={styles.infoText}>🛡️ Full App Functional</Text>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  shieldIcon: {
    fontSize: 60,
    color: '#61a3d2',
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 16,
    color: '#61a3d2',
    fontWeight: '500',
  },
  formSection: {
    width: '100%',
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
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#61a3d2',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  quickAccess: {
    marginVertical: 15,
  },
  quickTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickBtn: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  quickBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  signupLink: {
    alignItems: 'center',
    marginVertical: 15,
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupBold: {
    color: '#61a3d2',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: {
    fontSize: 12,
    color: '#2e7d32',
    marginBottom: 4,
  },
});

export default LoginScreen;