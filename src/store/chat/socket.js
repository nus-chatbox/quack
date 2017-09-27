export default (store) => {
  window.apiSocket.on('message', (message) => {
    store.commit('patchMessages', {
      messages: [message]
    });
  });
};
