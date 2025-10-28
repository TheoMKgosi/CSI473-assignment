import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function HomeScreen({ navigation }) {
  const user = { full_name: 'Test User', email: 'test@example.com' };

  const logout = () => {
    Alert.alert('Logged Out', 'You are now logged out.');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.full_name}!</Text>
      <Text style={styles.subtitle}>Neighborhood Watch</Text>

      {['Forum', 'PatrolStats', 'Panic', 'Subscription'].map(screen => (
        <TouchableOpacity key={screen} style={styles.button} onPress={() => navigation.navigate(screen)}>
          <Text style={styles.buttonText}>
            {screen === 'Forum' ? 'Community Forum' :
             screen === 'PatrolStats' ? 'Patrol Stats' :
             screen === 'Panic' ? 'Trigger Panic Alert' :
             'Manage Subscription'}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#61a3d2', marginBottom: 30 },
  button: { width: '100%', padding: 15, backgroundColor: '#61a3d2', borderRadius: 10, marginVertical: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
  logout: { marginTop: 30 },
  logoutText: { color: '#d32f2f' },
});