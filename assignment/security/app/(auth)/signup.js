// app/(auth)/signup.js - Updated handleSignUp function
const handleSignUp = async () => {
  const { firstName, lastName, email, password, confirmPassword } = formData;
  
  // Validation
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }
  
  if (password !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match');
    return;
  }
  
  if (password.length < 6) {
    Alert.alert('Error', 'Password must be at least 6 characters');
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch('http://localhost:8000/api/security/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase().trim(),
        password: password,
        // Optional fields can be added later
        phone_number: '',
        address: '',
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }
    
    Alert.alert(
      'Success', 
      data.message || 'Account created successfully! Please wait for administrator approval.',
      [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
    );
    
  } catch (error) {
    console.error('Signup error:', error);
    Alert.alert('Signup Failed', error.message || 'Could not create account. Please try again.');
  } finally {
    setIsLoading(false);
  }
};