import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>Neighborhood Watch</Text>
        <Text style={{ marginTop: 10, color: '#61a3d2' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#61a3d2',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            title: 'Dashboard',
            headerLeft: null,
          }} 
        />
        <Stack.Screen 
          name="Forum" 
          component={ForumScreen}
          options={{ title: 'Community Forum' }}
        />
        <Stack.Screen 
          name="PatrolStats" 
          component={PatrolStatsScreen}
          options={{ title: 'Patrol Statistics' }}
        />
        <Stack.Screen 
          name="Panic" 
          component={PanicScreen}
          options={{ title: 'Emergency Alert' }}
        />
        <Stack.Screen 
          name="Subscription" 
          component={SubscriptionScreen}
          options={{ title: 'Subscription' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;