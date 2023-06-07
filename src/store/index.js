import { createStore } from 'vuex'

export default createStore({
  state: {
    baseURL: 'http://94.24.237.230:7180/',
    user: {
      id: null,
      name: null,
      role: null,
      token: null
    }
  },
  getters: {
    getBaseURL(state) {
      return state.baseURL;
    },
    isAuthenticated(state) {
      return state.user.id != null;
    },
    getCurrentUser(state) {
      return state.user;
    },
    getUserRole(state) {
      return state.user.role;
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    logout(state) {
      state.user = {
        id: null,
        name: null,
        role: null,
        token: null
      };
    }
  },
  actions: {
  },
  modules: {
  }
})
