import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import ForumScreen from './screens/ForumScreen';
import PatrolStatsScreen from './screens/PatrolStatsScreen';
import PanicScreen from './screens/PanicScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Forum" component={ForumScreen} />
        <Stack.Screen name="PatrolStats" component={PatrolStatsScreen} />
        <Stack.Screen name="Panic" component={PanicScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
