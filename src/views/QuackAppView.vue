<template>
  <div>
    <q-layout ref="layout" view="LHh LPr lFf">
      <q-toolbar slot="header">
        <q-btn flat icon="menu" @click="$refs.layout.toggleLeft()">
        </q-btn>
        <q-toolbar-title class="center-username">
          Nearby Quacks
        </q-toolbar-title>
        <q-btn flat icon="settings" @click="">
        </q-btn>
      </q-toolbar>
      <q-scroll-area slot="left">
      </q-scroll-area>
      <q-pull-to-refresh :handler="refreshChatGroupList">
        <chat-group-list></chat-group-list>
      </q-pull-to-refresh>
      <div class="text-center fixed-bottom main-action-margin">
        <q-btn big round color="primary" @click="alert('woo')" icon="add" />
      </div>
    </q-layout>
  </div>
</template>

<script>
import { Ripple, QBtn, QLayout, QToolbar, QToolbarTitle, QCard, QFixedPosition, QPullToRefresh, QScrollArea } from 'quasar-framework';
import ChatGroupList from '@/components/ChatGroupList';

export default {
  directives: {
    Ripple
  },
  components: {
    QBtn,
    QLayout,
    QToolbar,
    QToolbarTitle,
    QCard,
    ChatGroupList,
    QFixedPosition,
    QPullToRefresh,
    QScrollArea
  },
  methods: {
    refreshChatGroupList(done) {
      setTimeout(() => {
        done();
      }, 1000);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.center-username
  display: flex
  justify-content: center
  flex: 1 1 auto

.main-action-margin
  margin-bottom: 1.2rem

.location-action-margin
  margin-bottom: 1.5rem
  margin-right: 1.5rem
</style>
