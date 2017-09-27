import Vue from 'vue';
import Vuex from 'vuex';

import userModule from './user/index';
import chatModule from './chat/index';
import chatSocketPlugin from './chat/socket';

Vue.use(Vuex);

/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-shadow */

export default new Vuex.Store({
  modules: {
    user: userModule,
    chat: chatModule
  },
  plugins: [
    chatSocketPlugin
  ]
});
