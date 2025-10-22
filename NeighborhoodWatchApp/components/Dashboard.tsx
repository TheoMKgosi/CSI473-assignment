import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Dashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/smart-home-shield.png')} style={styles.logo} />
      </View>
      <Text style={styles.welcome}>Welcome back, User001</Text>
      <Text style={styles.h}>h</Text>
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/home-icon.png')} style={styles.icon} />
          <Text style={styles.navText}>home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Notifications')}>
          <Image source={require('../assets/notification-icon.png')} style={styles.icon} />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('CommunityForum')}>
          <Image source={require('../assets/forum-icon.png')} style={styles.icon} />
          <Text style={styles.navText}>Community Forum</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.statsItem} onPress={() => navigation.navigate('PatrolStats')}>
        <Image source={require('../assets/graph-icon.png')} style={styles.statsIcon} />
        <Text style={styles.statsText}>Patrol Statistics</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.subItem} onPress={() => navigation.navigate('Subscription')}>
        <Image source={require('../assets/subscription-icon.png')} style={styles.statsIcon} />
        <Text style={styles.statsText}>Subscription</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panicItem} onPress={() => navigation.navigate('PanicButton')}>
        <Text style={styles.panicText}>Panic Button</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  logoContainer: { alignItems: 'center', marginVertical: 10 },
  logo: { width: 78, height: 65 },
  welcome: { fontSize: 24, color: '#000', fontFamily: 'Inter', textAlign: 'center' },
  h: { fontSize: 22, color: '#000', fontFamily: 'Inter', textAlign: 'center' },
  navContainer: { borderWidth: 1, borderColor: '#61A3D2', borderRadius: 10, padding: 10, marginVertical: 10, flexDirection: 'row', justifyContent: 'space-around' },
  navItem: { alignItems: 'center' },
  icon: { width: 40, height: 47 },
  navText: { color: '#61A3D2', fontSize: 12, fontFamily: 'Inter' },
  statsItem: { borderWidth: 1, borderColor: '#61A3D2', borderRadius: 5, padding: 10, marginVertical: 5, flexDirection: 'row', alignItems: 'center' },
  subItem: { borderWidth: 1, borderColor: '#61A3D2', borderRadius: 5, padding: 10, marginVertical: 5, flexDirection: 'row', alignItems: 'center' },
  panicItem: { borderWidth: 1, borderColor: '#61A3D2', borderRadius: 5, padding: 10, marginVertical: 5, alignItems: 'center' },
  statsIcon: { width: 50, height: 50, marginRight: 10 },
  statsText: { fontSize: 12, color: '#000', fontFamily: 'Inter' },
  panicText: { fontSize: 16, color: 'red', fontFamily: 'Inter' },
});

export default Dashboard;