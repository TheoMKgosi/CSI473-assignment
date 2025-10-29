// api.js
// Utility for making backend requests

export async function signupOfficer(data) {
  // Adjust the URL to your backend endpoint
  const response = await fetch('http://localhost:8000/api/security/signup/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Signup failed');
  }
  return response.json();
}
