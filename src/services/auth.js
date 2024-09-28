import api from './api';

const authService = {
  async login(username, password) {
    try {
      console.log('Attempting to login with:', { username, password });
      const response = await api.post('/login/', { username, password });
      console.log('Login response:', response);
      const token = response.data.token;
      localStorage.setItem('token', token);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      this.logAxiosError(error);
      throw error;
    }
  },
  async signup(user) {
    try {
      console.log('Attempting to signup with:', user);
      const response = await api.post('/signup/', user);
      console.log('Signup response:', response);
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      this.logAxiosError(error);
      throw error;
    }
  },
  logAxiosError(error) {
    if (error.response) {
      console.error('Error response:', error.response);
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
  }
};

export default authService;