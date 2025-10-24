import React, { useState } from 'react';
     import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
     import axios from 'axios';

     const SignupScreen = ({ navigation }) => {
       const [email, setEmail] = useState('');
       const [password, setPassword] = useState('');
       const [fullName, setFullName] = useState('');
       const [phone, setPhone] = useState('');
       const [address, setAddress] = useState('');

       const handleSignup = async () => {
         try {
           const response = await axios.post('https://<your-codespace>.github.dev:8000/api/signup/', {
             email,
             password,
             full_name: fullName,
             phone,
             address,
           });
           if (response.data.success) {
             Alert.alert('Success', 'Signed up successfully! Please wait for admin approval.');
             navigation.navigate('Login');
           } else {
             Alert.alert('Error', response.data.errors || 'Failed to sign up');
           }
         } catch (error) {
           Alert.alert('Error', 'Failed to sign up');
         }
       };

       return (
         <View style={styles.container}>
           <Text style={styles.title}>Sign Up</Text>
           <TextInput
             style={styles.input}
             placeholder="Full Name"
             value={fullName}
             onChangeText={setFullName}
           />
           <TextInput
             style={styles.input}
             placeholder="Email"
             value={email}
             onChangeText={setEmail}
             autoCapitalize="none"
           />
           <TextInput
             style={styles.input}
             placeholder="Password"
             value={password}
             onChangeText={setPassword}
             secureTextEntry
           />
           <TextInput
             style={styles.input}
             placeholder="Phone"
             value={phone}
             onChangeText={setPhone}
           />
           <TextInput
             style={styles.input}
             placeholder="Address"
             value={address}
             onChangeText={setAddress}
           />
           <TouchableOpacity style={styles.button} onPress={handleSignup}>
             <Text style={styles.buttonText}>Sign Up</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={() => navigation.navigate('Login')}>
             <Text style={styles.link}>Already have an account? Login</Text>
           </TouchableOpacity>
         </View>
       );
     };

     const styles = StyleSheet.create({
       container: {
         flex: 1,
         justifyContent: 'center',
         alignItems: 'center',
         padding: 20,
         backgroundColor: '#f5f5f5',
       },
       title: {
         fontSize: 24,
         fontWeight: 'bold',
         marginBottom: 20,
         color: '#333',
       },
       input: {
         width: '100%',
         padding: 10,
         marginVertical: 10,
         borderWidth: 1,
         borderColor: '#ccc',
         borderRadius: 5,
         backgroundColor: '#fff',
       },
       button: {
         width: '100%',
         padding: 15,
         backgroundColor: '#007bff',
         borderRadius: 5,
         alignItems: 'center',
         marginVertical: 10,
       },
       buttonText: {
         color: '#fff',
         fontSize: 16,
         fontWeight: 'bold',
       },
       link: {
         color: '#007bff',
         marginTop: 10,
       },
     });

     export default SignupScreen;
