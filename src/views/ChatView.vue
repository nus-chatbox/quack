<template>
  <div v-if="isValidRoom === null || isValidRoom">
    <q-layout class="bg-image">
      <q-modal ref="shareModal" :content-css="{padding: '20px'}">
        <h4>Share Quack on</h4>
        <share-modal-content :url="`/chat/${this.roomId}`"></share-modal-content>
        <q-btn id="closeModal" color="primary" @click="$refs.shareModal.close()">Close</q-btn>
      </q-modal>
      <q-toolbar class="fixed-top" slot="header">
          <q-btn flat icon="keyboard arrow left" @click="exitChat()"></q-btn>
        <q-toolbar-title class="center-username">
          {{roomName}}
        </q-toolbar-title>
        <q-btn flat icon="share" @click="$refs.shareModal.open();"></q-btn>
      </q-toolbar>
      <resize-observer @notify="handleResize" />
      <q-scroll-area :style="{ height: (clientHeight - 10) + 'px' }" ref="messageBox">
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
      </q-scroll-area>
      <q-input class="fixed-bottom message-input"
        v-model.trim="message"
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
import { QChatMessage, QSpinnerDots, QLayout, QToolbar, QToolbarTitle, QBtn, QPopover, QInput, QToggle, QList, QItem, QItemMain, QOptionGroup, Alert, Loading, QSpinnerCube, QModal, QModalLayout, QScrollArea } from 'quasar-framework';
import NotFoundView from '@/views/NotFoundView';
import ShareModalContent from '@/components/ShareModalContent';

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
    NotFoundView,
    QModal,
    QModalLayout,
    ShareModalContent,
    QScrollArea
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
      this.$refs.messageBox.setScrollPosition(this.$refs.messageBox.$el.scrollHeight, 1);
    })
    .catch((err) => {
      // eslint-disable-next-line
      console.error(err);
      this.isValidRoom = false;
      Loading.hide();
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.clientHeight = this.$el.clientHeight;
    });
  },
  updated() {
    this.$refs.messageBox.setScrollPosition(this.$refs.messageBox.$el.scrollHeight, 1);
  },
  methods: {
    exitChat() {
      this.$store.dispatch('leaveRoom');
      this.$router.push({ path: '/' });
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
    },
    handleResize() {
      this.clientHeight = this.$el.clientHeight;
    }
  },
  props: ['roomId'],
  data() {
    return {
      isValidRoom: null,
      anonymous: true,
      message: '',
      roomName: '',
      userId: this.$store.getters.getUserId,
      clientHeight: 0
    };
  },
  computed: {
    messages() {
      return this.$store.getters.getRoomMessages(this.roomId);
    }
  }
};
</script>

<style scoped lang="stylus">
message-input-height = 35px
message-box-top-margin = message-input-height - 10px
message-box-bottom-margin = message-input-height - 25px

.message-input
  margin: 0
  min-height: message-input-height

.message-box
  margin-top: message-box-top-margin
  margin-bottom: message-box-bottom-margin

.bg-image
  background-image: url('/static/img/bg.png');
  background-size: cover

#closeModal
  width: 100%
</style>