import { createStore } from 'vuex';
import auth from './modules/auth';

export default createStore({
   modules: {
        auth
   },
  state: {
    isAuthenticated: false,
    user: null,
  },
  mutations: {
    SET_AUTHENTICATED(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
    SET_USER(state, user) {
      state.user = user;
    },
  },
  actions: {
    login({ commit }, userData) {
      commit('SET_AUTHENTICATED', true);
      commit('SET_USER', userData);
    },
    logout({ commit }) {
      commit('SET_AUTHENTICATED', false);
      commit('SET_USER', null);
    },
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
  },
})
