import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image, CheckBox } from 'react-native';
import axios from 'axios';

const SignUp = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignUp = async () => {
    if (!agreeTerms) return Alert.alert('Error', 'Agree to terms');
    try {
      const response = await axios.post('http://your-django-api/signup/', { fullName, email, phone, address });
      if (response.data.success) {
        Alert.alert('Success', 'Submitted for approval');
        navigation.navigate('Login');
      } else Alert.alert('Error', 'Failed');
    } catch (error) {
      Alert.alert('Error', 'Server error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Neighborhood Watch</Text>
      <View style={styles.logoContainer}>
        <Image source={{ uri: 'path-to-smart-home-shield' }} style={styles.logo} />
      </View>
      <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <View style={styles.checkboxContainer}>
        <CheckBox value={agreeTerms} onValueChange={setAgreeTerms} />
        <Text style={styles.checkboxText}>Agree to the Terms</Text>
      </View>
      <Button title="Sign Up" onPress={handleSignUp} color="#61A3D2" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  title: { fontSize: 24, color: '#000' },
  logoContainer: { alignItems: 'center' },
  logo: { width: 62, height: 83 },
  input: { backgroundColor: '#61A3D242', height: 50, marginVertical: 10, padding: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkboxText: { fontSize: 22, color: '#000' },
});

export default SignUp;