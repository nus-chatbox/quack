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
        <q-btn flat icon="" @click="">
        </q-btn>
      </q-toolbar>

      <!-- Drawer panel on the left -->
      <q-list slot="left" no-border class="bg-light left-nav">
        <div class="panel-user bg-white">
          <img src="../assets/logo.png" style="height: 75px; width: 75px;"/>
          <span class="container-username">
            <q-btn id="editableUsername" @click="editUsername()" class="font-username">{{ this.$store.getters.getUsername }}</q-btn>
            <q-field :count="25" id="newUsername" class="hidden">
              <q-input max-length="25" @keydown.enter="saveUsername()" v-model="newUsername" />
            </q-field>
          </span>
        </div>
        <q-item-separator />
        <router-link to="/about">
          <q-list-header class="text-center">About</q-list-header>
        </router-link>
        <router-link to="/terms">
          <q-list-header class="text-center">Terms</q-list-header>
        </router-link>
        <router-link to="/privacy">
          <q-list-header class="text-center">Privacy</q-list-header>
        </router-link>
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
import { Ripple, QBtn, QField, QInput, QLayout, QToolbar, QToolbarTitle, QCard, QFixedPosition, QList, QItemSeparator, QToggle, QListHeader } from 'quasar-framework';
import ChatGroupList from '@/components/ChatGroupList';
import GroupCreationModal from '@/components/GroupCreationModal';


export default {
  directives: {
    Ripple
  },
  components: {
    QBtn,
    QField,
    QInput,
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
      isAnonymous: false,
      newUsername: this.$store.getters.getUsername
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
      .then(
        this.$router.go('/')
      );
    },
    editUsername() {
      document.getElementById('editableUsername').classList.toggle('hidden');
      document.getElementById('newUsername').classList.toggle('hidden');
    },
    saveUsername() {
      document.getElementById('editableUsername').classList.toggle('hidden');
      document.getElementById('newUsername').classList.toggle('hidden');
      this.$store.dispatch('patchUsername', {
        displayName: this.newUsername
      });
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

.container-username
  margin-left: 10px
  max-width: 60%

.font-username
  font-size: 15px
  text-overflow: ellipsis

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

.panel-user
  align-items: center
  display: flex
  flex-flow: row nowrap
  height: 100px
  justify-content: center
  padding: 10px
</style>
