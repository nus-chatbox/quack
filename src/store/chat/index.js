/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-template */
import Vue from 'vue';

export default {
  state: {
    nearbyRooms: [],
    roomIdToMessages: {}
  },
  getters: {
    getRoomMessages(state) {
      return (roomId) => {
        return state.roomIdToMessages[roomId];
      };
    }
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
        Vue.set(state.roomIdToMessages, message.roomId, []);
      });
    },
    patchMessages(state, payload) {
      payload.messages.forEach((message) => {
        if (state.roomIdToMessages[message.roomId] === undefined) {
          Vue.set(state.roomIdToMessages, message.roomId, []);
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
    getMessages({ dispatch, commit }, payload) {
      return dispatch('fetchMessages', payload).then((serverResponse) => {
        commit('initializeMessages', serverResponse);
        commit('patchMessages', serverResponse);
        return Promise.resolve(serverResponse);
      }).catch((err) => {
        console.error(err);
        return Promise.reject(err);
      });
    },
    fetchMessages({ rootState }, payload) {
      return fetch(window.apiUrl + '/rooms/' + payload.roomId + '/messages', {
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
    enterRoom({ dispatch, state }, payload) {
      return fetch(window.apiUrl + '/rooms/' + payload, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then((jsonResponse) => {
        if (jsonResponse.rooms.length === 1) {
          return Promise.resolve(jsonResponse.rooms[0]);
        }
        return Promise.reject('error (room does not exists)');
      }).then((room) => {
        const alreadySubscribedRooms = state.nearbyRooms.map(nearbyRoom => nearbyRoom.id);
        if (!alreadySubscribedRooms.includes(room.id)) {
          window.apiSocket.emit('subscribe', [room.id]);
        }
        return Promise.resolve(room);
      })
      .catch(err => Promise.reject(err));
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
