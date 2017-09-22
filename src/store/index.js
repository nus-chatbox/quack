import Vue from 'vue';
import Vuex from 'vuex';

import loginModule from './login/index';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    login: loginModule
  }
});
