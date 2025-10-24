import React, { useState } from 'react';
     import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
     import axios from 'axios';

     const LoginScreen = ({ navigation }) => {
       const [email, setEmail] = useState('');
       const [password, setPassword] = useState('');

       //const handleLogin = async () => {
         //try {
         //  const response = await axios.post('https://<your-codespace>.github.dev:8000/api/login/', {
        //     email,
          //   password,
           //});
           //if (response.data.success) {
            // Alert.alert('Success', 'Logged in successfully!');
             // Navigate to main app screen (to be implemented)
           //} else {
             //Alert.alert('Error', 'Invalid credentials');
           //}
        // } catch (error) {
          // Alert.alert('Error', 'Failed to login');
       //  }
      // };

      const handleLogin = () => {
        navigation.navigate('Home');
      };

       return (
         <View style={styles.container}>
           <Text style={styles.title}>Neighborhood Watch</Text>
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
           <TouchableOpacity style={styles.button} onPress={handleLogin}>
             <Text style={styles.buttonText}>Login</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
             <Text style={styles.link}>Don't have an account? Sign Up</Text>
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

     export default LoginScreen;
