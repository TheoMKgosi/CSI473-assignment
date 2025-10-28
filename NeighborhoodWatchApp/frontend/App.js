import React, { useEffect, useState } from 'react';
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

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        Inter: require('./assets/fonts/Inter-Regular.ttf'),
      });
    } catch (e) {
      console.warn('Inter font not found – using system font');
    } finally {
      setFontsLoaded(true);
    }
  };

  useEffect(() => { loadFonts(); }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading…</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Forum" component={ForumScreen} />
        <Stack.Screen name="PatrolStats" component={PatrolStatsScreen} />
        <Stack.Screen name="Panic" component={PanicScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}