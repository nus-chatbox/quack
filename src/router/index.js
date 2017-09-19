import Vue from 'vue';
import VueRouter from 'vue-router';

import QuackAppView from '@/views/QuackAppView';
import LoginView from '@/views/LoginView';
import NotFoundView from '@/views/NotFoundView';

Vue.use(VueRouter);

const Router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'QuackAppView',
      component: QuackAppView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'LoginView',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '*',
      component: NotFoundView,
      meta: { requiresAuth: false },
    },
  ],
});

Router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    next('/login');
  } else {
    next();
  }
});

export default Router;
