<template>
  <div>
    <q-layout ref="layout" view="LHh LPr lFf">
      <!-- Header with two icons -->
      <q-toolbar slot="header">
        <q-btn flat icon="menu" @click="$refs.layout.toggleLeft()">
        </q-btn>
        <q-toolbar-title class="center-username">
          Nearby Quacks
        </q-toolbar-title>
        <div class="balance-toolbar"></div>
      </q-toolbar>

      <!-- Drawer panel on the left -->
      <q-list slot="left" no-border class="bg-light left-nav">
        <div class="row flex-center bg-white" style="height: 100px;">
          <img src="../assets/logo.png" style="height: 75px; width 75px;"/>
          <div style="margin-left: 15px">{{ this.$store.getters.getUsername }}</div>
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

      <!-- Main Body -->
      <div class="layout-view column">
        <chat-group-list class="group-list-vert"></chat-group-list>
        <div class="text-center main-action-margin add-button-vert">
          <q-btn big round color="primary" @click="$refs.modalWrapper.$refs.modal.open()" icon="add" />
        </div>
        <!-- Group Creation Modal -->
        <group-creation-modal ref="modalWrapper"></group-creation-modal>
      </div>

    </q-layout>
  </div>
</template>

<script>
import { Ripple, QBtn, QLayout, QToolbar, QToolbarTitle, QCard, QFixedPosition, QList, QItemSeparator, QToggle, QListHeader } from 'quasar-framework';
import ChatGroupList from '@/components/ChatGroupList';
import GroupCreationModal from '@/components/GroupCreationModal';


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
    QList,
    QItemSeparator,
    QToggle,
    QListHeader,
    GroupCreationModal
  },
  data() {
    return {
      isAnonymous: false
    };
  },
  methods: {
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

.layout-view
  min-height: calc(100vh - 51px)

.group-list-vert
  flex: 400

.add-button-vert
  flex: 1
  
.balance-toolbar
  flex: 0.17 0.17 auto
</style>
