import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './mutation_types';

Vue.use(Vuex);

const state = {
  isPendingLogin: false,
  isLoggedIn: false
};

/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */

const mutations = {
  [types.LOGIN](state) {
    state.isPendingLogin = true;
  },
  [types.LOGIN_SUCCESS](state) {
    state.isLoggedIn = true;
    state.isPendingLogin = false;
  },
  [types.LOGOUT](state) {
    state.isLoggedIn = false;
  }
};

/* eslint-enable no-param-reassign */
/* eslint-enable no-shadow */

const actions = {
  login({ commit }) {
    commit(types.LOGIN);
    return new Promise((resolve) => {
      setTimeout(() => {
        commit(types.LOGIN_SUCCESS);
        resolve();
      }, 1000);
    });
  },
  logout({ commit }) {
    commit(types.LOGOUT);
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions
});
