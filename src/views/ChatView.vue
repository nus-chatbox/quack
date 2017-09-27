<template>
  <q-layout>
    <q-modal ref="shareModal" :content-css="{padding: '20px'}">
      <h4>Share Quack on</h4>
      <router-view></router-view>
      <q-btn id="closeModal" color="primary" @click="$refs.shareModal.close()">Close</q-btn>
    </q-modal>
    <q-toolbar class="fixed-top" slot="header">
        <q-btn flat icon="keyboard arrow left" @click="exitChat()"></q-btn>
      <q-toolbar-title class="center-username">
        Brunch this weekend?
      </q-toolbar-title>
      <q-btn flat icon="settings">
        <q-popover ref="popover">
          <div id="triangle"></div>
          <table class="q-table" id="sidebarTable">
            <tr>
            <q-toggle id="anonym" v-model="anonymous" color="blue-grey-10" label="Anonymous Quack" left-label @focus="toggleAnom(anonymous)" />
            </tr>
            <tr>
            <router-link to="/chat/share"><q-btn flat @click="$refs.shareModal.open(); $refs.popover.close()" class="full-width sidebarButton">Invite Friend</q-btn></router-link>
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
        :sent="msg.sent"
        :text-color="msg.textColor"
        :bg-color="msg.bgColor"
        :name="msg.name"
        :avatar="msg.avatar"
        :text="msg.text"
        :stamp="msg.stamp"
      />

      <q-chat-message
        name="Vladimir"
        avatar="../assets/logo.png"
      >
        <q-spinner-dots size="2rem" />
      </q-chat-message>
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
      :after="[
                {
                  icon: 'attach file',
                  content: false,
                  handler () {
                    // do something...
                  }
                },
                {
                  icon: 'photo camera',
                  content: false,
                  handler () {
                    // do something...
                  }
                }
              ]"
    />
  </q-layout>
</template>

<script>
import 'quasar-extras/animate/bounceInDown.css';
import 'quasar-extras/animate/fadeOut.css';

import { QChatMessage, QSpinnerDots, QLayout, QToolbar, QToolbarTitle, QBtn, QPopover, QInput, QToggle, QList, QItem, QItemMain, QOptionGroup, Alert, QModal, QModalLayout } from 'quasar-framework';

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
    QModal,
    QModalLayout
  },
  methods: {
    exitChat() {
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
    }
  },
  data() {
    return {
      anonymous: true,
      message: '',
      messages: [
        {
          label: 'Sunday, 19th'
        },
        {
          name: 'Vladimir',
          text: ['How are you?'],
          avatar: 'statics/boy-avatar.png',
          stamp: 'Yesterday 13:34'
        },
        {
          name: 'Jane',
          text: ['I\'m good, thank you!', 'And you?'],
          sent: true,
          textColor: 'white',
          bgColor: 'black',
          avatar: 'statics/linux-avatar.png',
          stamp: 'Yesterday at 13:50'
        },
        {
          name: 'Jane',
          text: ['And you?'],
          sent: true,
          avatar: 'statics/linux-avatar.png',
          stamp: 'Yesterday at 13:51'
        },
        {
          label: 'Sunday, 19th'
        },
        {
          name: 'Vladimir',
          bgColor: 'amber',
          textColor: 'white',
          text: ['Fine. Nice weather today, right?', 'Hmm...'],
          avatar: 'statics/boy-avatar.png',
          stamp: '13:55'
        },
        {
          label: 'Sunday, 19th'
        },
        {
          name: 'Vladimir',
          text: ['How are you?'],
          avatar: 'statics/boy-avatar.png',
          stamp: 'Yesterday 13:34'
        },
        {
          name: 'Jane',
          text: ['I\'m good, thank you!', 'And you?'],
          sent: true,
          avatar: 'statics/linux-avatar.png',
          stamp: 'Yesterday at 13:50'
        },
        {
          name: 'Jane',
          text: ['And you?'],
          sent: true,
          avatar: 'statics/linux-avatar.png',
          stamp: 'Yesterday at 13:51'
        },
        {
          label: 'Sunday, 19th'
        },
        {
          name: 'Vladimir',
          text: ['Fine. Nice weather today, right?', 'Hmm...'],
          avatar: 'statics/boy-avatar.png',
          stamp: '13:55'
        },
        {
          label: 'Sunday, 19th'
        },
        {
          name: 'Vladimir',
          text: ['How are you?'],
          avatar: 'statics/boy-avatar.png',
          stamp: 'Yesterday 13:34'
        }
      ]
    };
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
#closeModal
  width: 100%
</style>