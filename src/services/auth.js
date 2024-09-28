import api from './api';

const authService = {
  async login(username, password) {
    try {
      const response = await api.post('/login/', { username, password });
      const token = response.data.token;
      console.log('Received token:', token); // Debug log
      localStorage.setItem('token', token);
      // Other login logic...
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error);
    }
  },
  signup(user) {
    return api.post('/signup/', user);
  },
  // Add other auth-related methods as needed
};

export default authService;