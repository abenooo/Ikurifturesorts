const axios = require('axios');

async function testAuth() {
  try {
    // First, let's login to get a token
    const loginResponse = await axios.post('http://localhost:5003/api/auth/signin', {
      email: 'test@example.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('Login successful. Token:', token);

    // Test a protected route with the token
    const protectedResponse = await axios.get('http://localhost:5003/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Protected route response:', protectedResponse.data);

    // Test with invalid token
    try {
      await axios.get('http://localhost:5003/api/users/me', {
        headers: {
          'Authorization': 'Bearer invalid_token'
        }
      });
    } catch (error) {
      console.log('Invalid token test - Expected error:', error.response?.data);
    }

    // Test without token
    try {
      await axios.get('http://localhost:5003/api/users/me');
    } catch (error) {
      console.log('No token test - Expected error:', error.response?.data);
    }

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testAuth(); 