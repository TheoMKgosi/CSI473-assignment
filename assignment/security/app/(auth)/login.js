// app/(auth)/login.js - Updated handleLogin function
const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  setIsLoading(true);
  
  try {
    const response = await fetch('http://localhost:8002/api/security/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store token and user data
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('userData', JSON.stringify(data.user));
    
    Alert.alert('Success', data.message || 'Logged in successfully!');
    router.replace('/(tabs)');
    
  } catch (error) {
    console.error('Login error:', error);
    Alert.alert('Error', error.message || 'Failed to login. Please check your credentials.');
  } finally {
    setIsLoading(false);
  }
};