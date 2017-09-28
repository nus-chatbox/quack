/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-template */
export default {
  state: {
    currentRoom: {},
    nearbyRooms: [],
    roomIdToMessages: {}
  },
  getters: {

  },
  mutations: {
    enterRoom(state, payload) {
      state.currentRoom = payload;
      window.apiSocket.emit('subscribe', payload.roomId);
    },
    leaveRoom(state) {
      window.apiSocket.emit('unsubscribe', state.currentRoom);
      state.currentRoom = {};
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
      return fetch(window.apiUrl + '/rooms/' + state.currentRoom.id + '/messages', {
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
    enterRoom({ commit }) {
      // return fetch(window.apiUrl + '/rooms/' + payload.id, {
      //   method: 'GET',
      //   headers: {
      //     Authorization: `bearer ${rootState.user.jwtToken}`,
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json'
      //   }
      // }).then((response) => {
      //   return response.json();
      // })
      Promise.resolve({ rooms: [{
        created_at: '2017-09-27T16:09:43.000Z',
        distance: 0.0008956178097774487,
        id: 20,
        latitude: '1.336395',
        longitude: '103.927959',
        ownerId: 1,
        photoUrl: null,
        title: 'asdfasdf',
        updated_at: '2017-09-27T16:09:43.000Z'
      }] })
      .then((json) => {
        const rooms = json.rooms;
        if (rooms.length === 0) {
          return Promise.reject();
        }
        commit('enterRoom', rooms[0]);
        return Promise.resolve();
      }).catch((err) => {
        return Promise.reject(err);
      });
    },
    leaveRoom({ commit }) {
      commit('leaveRoom');
    }
  }
};
