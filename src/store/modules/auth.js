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
      commit('SET_TOKEN', token);
      commit('SET_USER', response.data.user);
    } catch (error) {
      console.error('Login error', error);
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};