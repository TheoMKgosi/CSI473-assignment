import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const Subscription = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscription</Text>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('PaySubscription')}>
        <Image source={require('../assets/money-icon.png')} style={styles.icon} />
        <Text style={styles.text}>Pay</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ManageSubscription')}>
        <Image source={require('../assets/tools-icon.png')} style={styles.icon} />
        <Text style={styles.text}>Manage Subscription</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, color: '#000', fontFamily: 'Inter', textAlign: 'center', marginVertical: 10 },
  item: { borderWidth: 1, borderColor: '#61A3D2', borderRadius: 10, padding: 10, marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  icon: { width: 50, height: 50, marginRight: 10 },
  text: { fontSize: 14, color: '#000', fontFamily: 'Inter' },
});

export default Subscription;