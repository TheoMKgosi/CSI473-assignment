import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';

const SignUp = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignUp = async () => {
    if (!agreeTerms) return Alert.alert('Error', 'Please agree to the terms');
    try {
      const response = await axios.post('http://your-django-api/signup/', { fullName, email, phone, address });
      if (response.data.success) {
        Alert.alert('Success', 'Registration submitted for approval');
        navigation.navigate('Login');
      } else Alert.alert('Error', 'Registration failed');
    } catch (error) {
      Alert.alert('Error', 'Server error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/smart-home-shield.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Join Neighborhood Watch</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} placeholderTextColor="#0004" />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} placeholderTextColor="#0004" />
        <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} placeholderTextColor="#0004" />
        <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} placeholderTextColor="#0004" />
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox value={agreeTerms} onValueChange={setAgreeTerms} tintColors={{ true: '#61A3D2', false: '#61A3D2' }} />
        <Text style={styles.checkboxText}>Agree to the Terms</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleSignUp} color="#61A3D2" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  logoContainer: { alignItems: 'center', marginVertical: 20 },
  logo: { width: 62, height: 83 },
  title: { fontSize: 24, color: '#000', fontFamily: 'Inter', textAlign: 'center' },
  inputContainer: { width: 306, alignSelf: 'center' },
  input: { backgroundColor: '#61A3D242', height: 50, marginVertical: 10, padding: 10, fontSize: 24, color: '#000', fontFamily: 'Inter', opacity: 0.4 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, width: 238, alignSelf: 'center' },
  checkboxText: { fontSize: 22, color: '#000', fontFamily: 'Inter' },
  buttonContainer: { width: 271, alignSelf: 'center', marginVertical: 10 },
});

export default SignUp;