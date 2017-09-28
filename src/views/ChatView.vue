<template>
  <div v-if="isValidRoom === null || isValidRoom">
    <q-layout>
      <q-toolbar class="fixed-top" slot="header">
          <q-btn flat icon="keyboard arrow left" @click="exitChat"></q-btn>
        <q-toolbar-title class="center-username">
          {{roomName}}
        </q-toolbar-title>
        <q-btn flat icon="settings">
          <q-popover ref="popover">
            <div id="triangle"></div>
            <table class="q-table" id="sidebarTable">
              <tr>
              <q-toggle id="anonym" v-model="anonymous" color="blue-grey-10" label="Anonymous Quack" left-label @focus="toggleAnom(anonymous)" />
              </tr>
              <tr>
              <q-btn flat class="full-width sidebarButton">Invite Friend</q-btn>
              </tr>
              <tr>
              <q-btn flat class="full-width sidebarButton">Report Chat</q-btn>
              </tr>
            </table>
          </q-popover>
        </q-btn>
      </q-toolbar>
      <div class="layout-padding message-box">
        <q-chat-message
          v-for="(msg, index) in messages"
          :key="index"
          :label="msg.label"
          :sent="msg.userId === userId"
          :name="msg.owner.displayName"
          avatar="/static/img/logo.png"
          :text="[msg.text]"
          :stamp="msg.stamp"
        />
      </div>
      <q-input class="fixed-bottom message-input"
        v-model="message"
        type="textarea"
        placeholder="Enter your message"
        :min-rows="1"
        clearable
        inverted
        align="center"
        color="primary"
        @keydown.enter="sendMessage"
        :after="[
                  {
                    icon: 'send',
                    handler: sendMessage
                  }
                ]"
      />
    </q-layout>
  </div>
  <div v-else>
    <not-found-view />
  </div>
</template>

<script>
import 'quasar-extras/animate/bounceInDown.css';
import 'quasar-extras/animate/fadeOut.css';
import { QChatMessage, QSpinnerDots, QLayout, QToolbar, QToolbarTitle, QBtn, QPopover, QInput, QToggle, QList, QItem, QItemMain, QOptionGroup, Alert, Loading, QSpinnerCube } from 'quasar-framework';
import NotFoundView from '@/views/NotFoundView';

export default {
  components: {
    QChatMessage,
    QSpinnerDots,
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QPopover,
    QInput,
    QToggle,
    QList,
    QItem,
    QItemMain,
    QOptionGroup,
    Alert,
    NotFoundView
  },
  created() {
    Loading.show({
      spinner: QSpinnerCube
    });
    Promise.all([
      this.$store.dispatch('enterRoom', this.roomId),
      this.$store.dispatch('getMessages', { roomId: this.roomId })
    ])
    .then((roomAndMessages) => {
      this.isValidRoom = true;
      this.roomName = roomAndMessages[0].title;
      this.$forceUpdate();
      Loading.hide();
    })
    .catch(() => {
      this.isValidRoom = false;
      Loading.hide();
    });
  },
  methods: {
    exitChat() {
      this.$store.dispatch('leaveRoom');
      this.$router.push({ path: '/' });
    },
    toggleAnom(anonymous) {
      let alert = null;
      if (anonymous) {
        alert = Alert.create({
          color: 'tertiary',
          icon: 'visibility',
          html: 'You\'re now public',
          enter: 'bounceInDown',
          leave: 'bounceOutUp',
          position: 'top-center',
          id: 'one',
          dismissible: true
        });
      } else {
        alert = Alert.create({
          color: 'positive',
          icon: 'visibility off',
          html: 'You\'re now Anonmyous',
          enter: 'bounceInDown',
          leave: 'bounceOutUp',
          position: 'top-center',
          dismissible: true
        });
      }
      window.setTimeout(() => {
        alert.dismiss();
      }, 10);
    },
    sendMessage() {
      fetch(`${window.apiUrl}/rooms/${this.roomId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `bearer ${this.$store.state.user.jwtToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: this.message
        })
      })
      .then(() => { this.message = ''; })
      // eslint-disable-next-line no-console
      .catch((err) => { console.error(err); });
    }
  },
  props: ['roomId'],
  data() {
    return {
      isValidRoom: null,
      anonymous: true,
      message: '',
      roomName: '',
      userId: this.$store.getters.getUserId
    };
  },
  computed: {
    messages() {
      return this.$store.getters.getRoomMessages(this.roomId);
    }
  }
};
</script>

<!--Note:
  1. q-popover overflow: visible cannot be helped
-->
<style scoped lang="stylus">
message-input-height = 45px
message-box-top-margin = message-input-height - 15px
message-box-bottom-margin = message-input-height - 25px

.message-input
  margin: 0
  min-height: message-input-height

.message-box
  margin-top: message-box-top-margin
  margin-bottom: message-box-bottom-margin

#sidebarTable
  border: 10px solid rgb(52,73,94)
.q-popover
  overflow: visible
#anonym
  min-width: 150px
  color: white
  background: rgb(52,73,94)
  width: 100%
.sidebarButton
  font-size: 100%
  background-color: rgb(52,73,94)
  color: white
#triangle
  position: absolute
  left: 75%
  top: -10%
  border-left: 15px solid transparent
  border-right: 15px solid transparent
  border-bottom: 15px solid rgb(52,73,94)
</style>