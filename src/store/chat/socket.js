import Notify from 'notifyjs';
import quackLogo from '../../assets/logo.png';

export default (store) => {
  let permissionDenied = false;
  let permissionGranted = false;

  window.apiSocket.on('message', (message) => {
    if (store.getters.getUserId !== message.userId) {
      if (!Notify.needsPermission) {
        permissionGranted = true;
      }

      if (!permissionDenied && !permissionGranted && Notify.isSupported()) {
        Notify.requestPermission(() => {
          permissionGranted = true;
        }, () => {
          permissionDenied = true;
        });
      }

      if (permissionGranted) {
        const newNotification = new Notify('New Messagge', {
          body: message.text,
          icon: quackLogo
        });
        newNotification.show();
      }
    }

    store.commit('patchMessages', {
      messages: [message]
    });
  });
};
