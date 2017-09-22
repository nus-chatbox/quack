/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-template */
export default {
  state: {
    fbToken: window.localStorage.getItem('fbToken'),
    jwtToken: window.localStorage.getItem('jwtToken')
  },
  getters: {
    isLoggedIn(state) {
      return (state.fbToken !== null) && (state.jwtToken !== null);
    }
  },
  mutations: {
    login(state, payload) {
      state.fbToken = payload.fbToken;
      state.jwtToken = payload.jwtToken;
      window.localStorage.setItem('fbToken', payload.fbToken);
      window.localStorage.setItem('jwtToken', payload.jwtToken);
    },
    logout(state) {
      state.fbToken = null;
      state.jwtToken = null;
      window.localStorage.setItem('fbToken', null);
      window.localStorage.setItem('jwtToken', null);
    }
  },
  actions: {
    login({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        window.FB.login((response) => {
          if (response.authResponse) {
            resolve(response.authResponse);
          } else {
            reject('User cancelled login authentication');
          }
        });
      }).then((authResponse) => {
        return dispatch('serverAuthentication', {
          authResponse
        });
      }).then((serverResponse) => {
        commit('login', serverResponse);
      }).catch((err) => {
        console.error(err);
        commit('logout');
      });
    },
    logout({ commit }) {
      commit('logout');
    },
    serverAuthentication({ commit }, payload) {
      return fetch(window.apiUrl + '/authenticate', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fbToken: payload.authResponse.accessToken
        })
      }).then((response) => {
        return response.json();
      });
    }
  }
};
