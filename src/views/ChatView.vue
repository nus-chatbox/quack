<template>
  <q-layout>
    <q-toolbar class="fixed-top" slot="header">
        <q-btn flat icon="keyboard arrow left" @click="exitChat()"></q-btn>
      <q-toolbar-title class="center-username">
        Brunch this weekend?
      </q-toolbar-title>
      <q-btn flat icon="settings" @click="$refs.layout.toggleLeft()">
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
import { QChatMessage, QSpinnerDots, QLayout, QToolbar, QToolbarTitle, QBtn, QInput } from 'quasar-framework';

export default {
  components: {
    QChatMessage,
    QSpinnerDots,
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QInput
  },
  methods: {
    exitChat() {
      this.$router.push({ path: '/' });
    }
  },
  data() {
    return {
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

</style>