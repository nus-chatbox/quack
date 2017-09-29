import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '@/store';
import QuackAppView from '@/views/QuackAppView';
import LoginView from '@/views/LoginView';
import ChatView from '@/views/ChatView';
import TermsView from '@/views/TermsView';
import PrivacyView from '@/views/PrivacyView';
import AboutView from '@/views/AboutView';
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
      path: '/chat/:roomId',
      name: 'ChatView',
      component: ChatView,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/terms',
      name: 'TermsView',
      component: TermsView,
      meta: { requiresAuth: false }
    },
    {
      path: '/privacy',
      name: 'PrivacyView',
      component: PrivacyView,
      meta: { requiresAuth: false }
    },
    {
      path: '/about',
      name: 'AboutView',
      component: AboutView,
      meta: { requiresAuth: false }
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
    window.gtag('config', 'UA-106948311-1', { page_path: '/login' });
    next('/login');
  } else {
    window.gtag('config', 'UA-106948311-1', { page_path: to.path });
    next();
  }
});

export default Router;
