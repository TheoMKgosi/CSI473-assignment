import AsyncStorage from '@react-native-async-storage/async-storage';

const resetAuth = async () => {
  try {
    await AsyncStorage.removeItem('token');
    console.log('Auth state reset successfully');
  } catch (e) {
    console.error('Error resetting auth state:', e);
  }
};

resetAuth();