import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const Subscription = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscription</Text>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('PaySubscription')}>
        <Image source={{ uri: 'path-to-money-icon' }} style={styles.icon} />
        <Text style={styles.text}>Pay</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ManageSubscription')}>
        <Image source={{ uri: 'path-to-tools-icon' }} style={styles.icon} />
        <Text style={styles.text}>Manage Subscription</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, color: '#000' },
  item: { borderWidth: 1, borderColor: '#61A3D2', borderRadius: 10, height: 104, justifyContent: 'center', alignItems: 'center' },
  icon: { width: 50, height: 50 },
  text: { fontSize: 14, color: '#000' },
});

export default Subscription;