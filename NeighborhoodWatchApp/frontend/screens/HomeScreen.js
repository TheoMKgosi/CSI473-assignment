import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const HomeScreen = ({ navigation, route }) => {
  const { token } = route.params || {};

  return (
    <View style={styles.dashboard}>
      <Text style={styles.welcomeBack}>Welcome back, User</Text>
      <View style={styles.smartHomeShield}>
        <Image source={require('../../assets/smart-home-shield.png')} style={styles.smartHomeShieldInner} />
      </View>
      <View style={styles.component9}>
        <View style={styles.rectangle10}>
          <TouchableOpacity
            style={styles.component6}
            onPress={() => navigation.navigate('Home', { token })}
          >
            <Image source={require('../../assets/home-icon.png')} style={styles.homeIcon} />
            <Text style={styles.homeText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.component8}
            onPress={() => navigation.navigate('Forum', { token })}
          >
            <Image source={require('../../assets/forum-icon.png')} style={styles.group2} />
            <Text style={styles.forumText}>Forum</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.component12}
        onPress={() => navigation.navigate('PatrolStats', { token })}
      >
        <View style={styles.rectangle13}>
          <Image source={require('../../assets/patrol-icon.png')} style={styles.group3} />
          <Text style={styles.patrolStatisticsText}>Patrol Statistics</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.component13}
        onPress={() => navigation.navigate('Subscription', { token })}
      >
        <View style={styles.rectangle14}>
          <Image source={require('../../assets/subscription-icon.png')} style={styles.group4} />
          <Text style={styles.subscriptionText}>Subscription</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.component14}
        onPress={() => navigation.navigate('Panic', { token })}
      >
        <View style={styles.rectangle15}>
          <Image source={require('../../assets/panic-icon.png')} style={styles.group5} />
          <Text style={styles.panicButtonText}>Panic Button</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dashboard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  welcomeBack: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '400',
    color: '#000',
    marginBottom: 20,
  },
  smartHomeShield: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 78,
    height: 65,
    marginVertical: 10,
  },
  smartHomeShieldInner: {
    width: 78,
    height: 65,
    backgroundColor: '#d3d3d3',
  },
  component9: {
    width: '100%',
    marginVertical: 10,
  },
  rectangle10: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#61a3d2',
    borderRadius: 10,
    padding: 10,
  },
  component6: {
    alignItems: 'center',
    width: 70,
  },
  homeIcon: {
    width: 40,
    height: 47,
    backgroundColor: '#d3d3d3',
  },
  homeText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: '#61a3d2',
    marginTop: 5,
  },
  component8: {
    alignItems: 'center',
    width: 70,
  },
  group2: {
    width: 25,
    height: 25,
  },
  forumText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: '#61a3d2',
    marginTop: 5,
  },
  component12: {
    width: '100%',
    marginVertical: 10,
  },
  rectangle13: {
    borderWidth: 1,
    borderColor: '#61a3d2',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  group3: {
    width: 50,
    height: 50,
  },
  patrolStatisticsText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
    marginTop: 5,
  },
  component13: {
    width: '100%',
    marginVertical: 10,
  },
  rectangle14: {
    borderWidth: 1,
    borderColor: '#61a3d2',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  group4: {
    width: 50,
    height: 50,
  },
  subscriptionText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
    marginTop: 5,
  },
  component14: {
    width: '100%',
    marginVertical: 10,
  },
  rectangle15: {
    borderWidth: 1,
    borderColor: '#61a3d2',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  group5: {
    width: 50,
    height: 50,
  },
  panicButtonText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
    marginTop: 5,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#dc3545',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
  },
});

export default HomeScreen;