import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '@/store';
import QuackAppView from '@/views/QuackAppView';
import LoginView from '@/views/LoginView';
import ChatView from '@/views/ChatView';
import NotFoundView from '@/views/NotFoundView';

Vue.use(VueRouter);

const Router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'QuackAppView',
      component: QuackAppView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'LoginView',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/chat',
      name: 'ChatView',
      component: ChatView,
      meta: { requiresAuth: true }
    },
    {
      path: '*',
      component: NotFoundView,
      meta: { requiresAuth: true }
    }
  ]
});

Router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default Router;