import axios from 'axios';

const state = {
  token: localStorage.getItem('token') || null,
  user: null,
};

const getters = {
  isAuthenticated: state => !!state.token,
  user: state => state.user,
};

const actions = {
  async loginUser({ commit }, credentials) {
    try {
      const response = await axios.post('/api/login/', credentials);
      const token = response.data.token;
      localStorage.setItem('token', token);
      commit('setToken', token);
      // You might want to fetch user data here and commit it to the store
      return response;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      throw error;
    }
  },
  async logout({ commit }) {
    localStorage.removeItem('token');
    commit('SET_TOKEN', null);
    commit('SET_USER', null);
  },
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_USER(state, user) {
    state.user = user;
  },
  setToken(state, token) {
    state.token = token;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};