// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Quasar from 'quasar-framework';
import 'quasar-extras/material-icons';

import './style/app.mat.styl';
import App from './App';
import router from './router';

Vue.config.productionTip = false;
Vue.use(Quasar);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
