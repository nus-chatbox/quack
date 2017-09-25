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
      <q-list slot="left" no-border class="bg-light left-nav">
        <div class="row flex-center bg-white" style="height: 100px;">
          <img src="../assets/logo.png" style="height: 75px; width 75px;"/>
          <div style="margin-left: 15px">Donald Duck</div>
        </div>
        <q-item-separator />
        <q-list-header class="text-center">User Settings</q-list-header>
        <div class="row flex-center">
          <q-toggle v-model="isAnonymous" :left-label="true" label="Stay Anonymous" style="font-size:14px"/>
        </div>
        <q-item-separator />
        <q-btn icon="exit to app" class="full-width" @click="logout()">
          Log Out
        </q-btn>
      </q-list>
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
import { Ripple, QBtn, QLayout, QToolbar, QToolbarTitle, QCard, QFixedPosition, QPullToRefresh, QList, QItemSeparator, QToggle, QListHeader } from 'quasar-framework';
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
    QList,
    QItemSeparator,
    QToggle,
    QListHeader
  },
  data() {
    return {
      isAnonymous: false
    };
  },
  methods: {
    refreshChatGroupList(done) {
      setTimeout(() => {
        done();
      }, 1000);
    },
    logout() {
      this.$store.dispatch('logout')
      .then(
        this.$router.go('/')
      );
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

.left-nav
  height: 100%
  padding-top: 0px
</style>
