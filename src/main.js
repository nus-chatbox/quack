// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Quasar from 'quasar-framework';
import 'quasar-extras/material-icons';
import Vuelidate from 'vuelidate';
import VueResize from 'vue-resize';

import '@/style/app.mat.styl';
import App from '@/App';
import router from '@/router';
import store from '@/store';
import vueSocialPlugin from 'vue-social-sharing/dist/vue-social-sharing.min';

Vue.config.productionTip = false;
Vue.use(Quasar);
Vue.use(Vuelidate);
Vue.use(vueSocialPlugin);
Vue.use(VueResize);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  methods: {
    startapp() {
      document.getElementById('mainapp').classList.remove('hidden');
      document.getElementById('loading').classList.add('hidden');
    }
  }
}).startapp();

