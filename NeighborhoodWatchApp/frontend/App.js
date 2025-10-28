import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import { View, Text, StatusBar } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import ForumScreen from './screens/ForumScreen';
import PatrolStatsScreen from './screens/PatrolStatsScreen';
import PanicScreen from './screens/PanicScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';

const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        Inter: require('./assets/fonts/Inter-Regular.ttf'),
      });
    } catch (error) {
      console.log('Font load failed, using fallback:', error);
    } finally {
      setFontsLoaded(true);
    }
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff', // White background
            elevation: 2, // Subtle shadow on Android
            shadowColor: '#000', // Subtle shadow on iOS
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          },
          headerTintColor: '#61a3d2', // Blue back button
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            color: '#333', // Dark title text
          },
          headerBackTitle: 'Back', // Show "Back" text on iOS
          headerBackTitleVisible: true,
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            title: 'Dashboard',
            headerLeft: null, // No back button on Home screen
          }} 
        />
        <Stack.Screen 
          name="Forum" 
          component={ForumScreen}
          options={{ 
            title: 'Community Forum',
            headerTintColor: '#61a3d2', // Explicit blue back button
          }}
        />
        <Stack.Screen 
          name="PatrolStats" 
          component={PatrolStatsScreen}
          options={{ 
            title: 'Patrol Statistics',
            headerTintColor: '#61a3d2',
          }}
        />
        <Stack.Screen 
          name="Panic" 
          component={PanicScreen}
          options={{ 
            title: 'Emergency Alert',
            headerTintColor: '#61a3d2',
          }}
        />
        <Stack.Screen 
          name="Subscription" 
          component={SubscriptionScreen}
          options={{ 
            title: 'Subscription',
            headerTintColor: '#61a3d2',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;