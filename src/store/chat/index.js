/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-template */
export default {
  state: {
    currentRoom: null,
    nearbyRooms: [],
    roomIdToMessages: {}
  },
  getters: {

  },
  mutations: {
    enterRoom(state, payload) {
      state.currentRoom = payload.roomId;
      window.apiSocket.emit('subscribe', payload.roomId);
    },
    leaveRoom(state) {
      window.apiSocket.emit('unsubscribe', state.currentRoom);
      state.currentRoom = null;
    },
    updateNearbyRooms(state, payload) {
      state.nearbyRooms = payload.rooms;
    },
    initializeMessages(state, payload) {
      payload.messages.forEach((message) => {
        state.roomIdToMessages[message.roomId] = [];
      });
    },
    patchMessages(state, payload) {
      payload.messages.forEach((message) => {
        if (state.roomIdToMessages[message.roomId] === undefined) {
          state.roomIdToMessages[message.roomId] = [];
        }
        state.roomIdToMessages[message.roomId].push(message);
      });
    }
  },
  actions: {
    getNearbyRooms({ dispatch, commit }) {
      return dispatch('fetchNearbyRooms').then((serverResponse) => {
        commit('updateNearbyRooms', serverResponse);
        return Promise.resolve(serverResponse);
      }).catch((err) => {
        console.error(err);
        return Promise.reject(err);
      });
    },
    fetchNearbyRooms({ rootState }) {
      return fetch(window.apiUrl + '/rooms', {
        method: 'GET',
        headers: {
          Authorization: `bearer ${rootState.user.jwtToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      });
    },
    getMessages({ dispatch, commit }) {
      return dispatch('fetchMessages').then((serverResponse) => {
        commit('initializeMessages', serverResponse);
        commit('patchMessages', serverResponse);
        return Promise.resolve(serverResponse);
      }).catch((err) => {
        console.error(err);
        return Promise.reject(err);
      });
    },
    fetchMessages({ state, rootState }) {
      return fetch(window.apiUrl + '/rooms/' + state.currentRoom + '/messages', {
        method: 'GET',
        headers: {
          Authorization: `bearer ${rootState.user.jwtToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      });
    },
    enterRoom({ commit }, payload) {
      commit('enterRoom', payload);
    }
  }
};
