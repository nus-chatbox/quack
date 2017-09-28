/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-template */
export default {
  state: {
    nearbyRooms: [],
    roomIdToMessages: {}
  },
  getters: {

  },
  mutations: {
    updateNearbyRooms(state, payload) {
      const oldNearbyRoomIds = state.nearbyRooms.map(nearbyRoom => nearbyRoom.id);
      window.apiSocket.emit('unsubscribe', oldNearbyRoomIds);

      const newNearbyRoomIds = payload.rooms.map(nearbyRoom => nearbyRoom.id);
      window.apiSocket.emit('subscribe', newNearbyRoomIds);
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
    enterRoom({ state }, payload) {
      return fetch(window.apiUrl + '/rooms/' + payload, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then((jsonResponse) => {
        let returnPromise = Promise.reject('error (room does not exists)');
        if (jsonResponse.rooms.length === 1) {
          returnPromise = Promise.resolve(jsonResponse.rooms[0]);
        }
        return returnPromise;
      }).then((room) => {
        const alreadySubscribedRooms = state.nearbyRooms.map(nearbyRoom => nearbyRoom.id);
        if (!alreadySubscribedRooms.includes(room.id)) {
          window.apiSocket.emit('subscribe', [room.id]);
        }
        return Promise.resolve(room);
      });
    },
    leaveRoom({ state }, payload) {
      // Only need to unsubscribe if room was not in nearbyRooms
      const nearbyRoomIds = state.nearbyRooms.map(nearbyRoom => nearbyRoom.id);
      if (!nearbyRoomIds.includes(payload)) {
        window.apiSocket.emit('unsubscribe', [payload]);
      }
      return Promise.resolve();
    }
  }
};
