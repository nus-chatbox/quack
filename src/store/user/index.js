/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-template */
import jwtDecode from 'jwt-decode';

export default {
  state: {
    fbToken: window.localStorage.getItem('fbToken'),
    jwtToken: window.localStorage.getItem('jwtToken'),
    latitude: null,
    longitude: null,
    accuracy: null,
    lastUpdated: new Date()
  },
  getters: {
    isLoggedIn(state) {
      return (state.fbToken !== null) && (state.jwtToken !== null);
    },
    hasGeolocation(state) {
      return (state.latitude !== null) && (state.longitude !== null);
    },
    getUserId(state) {
      return JSON.parse(jwtDecode(state.jwtToken).sub).user.id;
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
      window.localStorage.removeItem('fbToken');
      window.localStorage.removeItem('jwtToken');
    },
    updateLocation(state, payload) {
      state.latitude = payload.coords.latitude;
      state.longitude = payload.coords.longitude;
      state.accuracy = payload.coords.accuracy;
      state.lastUpdated = new Date(payload.timestamp);
    },
    updateJwt(state, payload) {
      state.jwtToken = payload.jwtToken;
      window.localStorage.setItem('jwtToken', payload.jwtToken);
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
        return Promise.resolve(serverResponse);
      }).catch((err) => {
        console.error(err);
        commit('logout');
        return Promise.reject(err);
      });
    },
    logout({ commit }) {
      commit('logout');
      return Promise.resolve();
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
    },
    refreshLocation({ dispatch, commit }) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      return new Promise((resolve, reject) => {
        if (window.navigator.geolocation) {
          window.navigator.geolocation.getCurrentPosition(resolve, reject, options);
        } else {
          reject('Geolocation is not supported in this browser');
        }
      }).then((position) => {
        commit('updateLocation', position);
        return dispatch('updateServer');
      }).then((serverResponse) => {
        commit('updateJwt', serverResponse);
        return Promise.resolve(serverResponse);
      }).catch((err) => {
        console.error(err);
        return Promise.reject(err);
      });
    },
    updateServer({ state }) {
      return fetch(window.apiUrl + '/users', {
        method: 'PATCH',
        headers: {
          Authorization: `bearer ${state.jwtToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude: state.latitude,
          longitude: state.longitude
        })
      }).then((response) => {
        return response.json();
      });
    }
  }
};
