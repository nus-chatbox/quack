// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Quasar from 'quasar-framework';
import 'quasar-extras/material-icons';
import Vuelidate from 'vuelidate';

import '@/style/app.mat.styl';
import App from '@/App';
import router from '@/router';
import store from '@/store';

Vue.config.productionTip = false;
Vue.use(Quasar);
Vue.use(Vuelidate);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
