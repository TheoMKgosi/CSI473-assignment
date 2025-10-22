import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Dashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: 'path-to-smart-home-shield' }} style={styles.logo} />
      </View>
      <Text style={styles.welcome}>Welcome back, User001</Text>
      <Text style={styles.h}>h</Text>
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Image source={{ uri: 'path-to-home-icon' }} style={styles.icon} />
          <Text style={styles.navText}>home</Text>
        </TouchableOpacity>
        {/* Add other nav items similarly based on provided JSX */}
      </View>
      <TouchableOpacity style={styles.statsItem} onPress={() => navigation.navigate('PatrolStats')}>
        <Text style={styles.statsText}>Patrol Statistics</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.subItem} onPress={() => navigation.navigate('Subscription')}>
        <Text style={styles.subText}>Subscription</Text>
      </TouchableOpacity>
      {/* Add more based on full JSX */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  logoContainer: { alignItems: 'center' },
  logo: { width: 78, height: 65 },
  welcome: { fontSize: 24, color: '#000' },
  h: { fontSize: 22, color: '#000' },
  navContainer: { borderWidth: 1, borderColor: '#61A3D2', borderRadius: 10, height: 73 },
  navItem: { alignItems: 'center' },
  icon: { width: 40, height: 47 },
  navText: { color: '#61A3D2', fontSize: 12 },
  statsItem: { borderWidth: 1, borderColor: '#61A3D2', borderRadius: 5, height: 121, justifyContent: 'center', alignItems: 'center' },
  statsText: { fontSize: 12, color: '#000' },
  subItem: { /* similar */ },
});

export default Dashboard;