import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '@/store';
import QuackAppView from '@/views/QuackAppView';
import LoginView from '@/views/LoginView';
import ChatView from '@/views/ChatView';
import NotFoundView from '@/views/NotFoundView';
import Share from '@/views/Share';

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
      children: [
        {
          path: '',
          component: Share
        }
      ],
      component: ChatView,
      props: true,
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
    window.gtag('config', 'UA-106948311-1', { page_path: '/login' });
    next('/login');
  } else {
    window.gtag('config', 'UA-106948311-1', { page_path: to.path });
    next();
  }
});

export default Router;
