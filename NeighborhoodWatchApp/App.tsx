import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import CommunityForum from './components/CommunityForum';
import Subscription from './components/Subscription';
import OptOutCancel from './components/OptOutCancel';
import PaySubscription from './components/PaySubscription';
import PanicButton from './components/PanicButton';
import Notifications from './components/Notifications';
import PatrolStats from './components/PatrolStats';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="CommunityForum" component={CommunityForum} />
        <Stack.Screen name="Subscription" component={Subscription} />
        <Stack.Screen name="ManageSubscription" component={OptOutCancel} />
        <Stack.Screen name="PaySubscription" component={PaySubscription} />
        <Stack.Screen name="PanicButton" component={PanicButton} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="PatrolStats" component={PatrolStats} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}