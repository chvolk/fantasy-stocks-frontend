import api from './api';

const authService = {
  login(credentials) {
    return api.post('login/', credentials);
  },
  signup(user) {
    return api.post('signup/', user);
  },
  // Add other auth-related methods as needed
};

export default authService;