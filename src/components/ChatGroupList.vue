<template>
  <div>
    <q-pull-to-refresh v-if="isRefreshing == false" :handler="refreshChatGroupList" class="group-list-vert">
        <div v-if="nearbyRooms.length === 0" class="layout-padding text-center no-rooms-padding">
          <img src="/static/img/logo.png" class="responsive" style="max-width:12rem"/>
          <div class="layout-padding">
            <p>Oops! No one is quacking around you!</p>
            <p><strong> Start a new quack? </strong></p>
          </div>
        </div>
        <div v-else v-for="room in nearbyRooms">
          <q-transition appear enter="fadeIn" leave="fadeOut">
            <router-link :to="`/chat/${room.id}`">
              <chat-group :id="room.id" :name="room.title" :distance="room.distance"></chat-group>
            </router-link>
          </q-transition>
        </div>
    </q-pull-to-refresh>
    <div v-else>
      <q-inner-loading :visible="isRefreshing != false" style="top:-100px">
        <q-spinner-comment size="80px" color="primary"></q-spinner-comment>
        <p>Looking for quack rooms near you..</p>
        <p class="row"><strong><i>Ducks of the same feather, quack together. </i></strong></p>
        <p class="row"><strong>– A wise man</strong></p>
      </q-inner-loading>
    </div>
  </div>
</template>

<script>
import ChatGroup from '@/components/ChatGroup';
import { QPullToRefresh, QTransition, QInnerLoading, QSpinnerComment } from 'quasar-framework';
import 'quasar-extras/animate/fadeIn.css';
import 'quasar-extras/animate/fadeOut.css';

export default {
  components: {
    ChatGroup,
    QPullToRefresh,
    QTransition,
    QInnerLoading,
    QSpinnerComment
  },
  computed: {
    nearbyRooms() {
      return this.$store.state.chat.nearbyRooms;
    }
  },
  data() {
    return {
      isRefreshing: null
    };
  },
  methods: {
    refreshChatGroupList(done) {
      this.$store.dispatch('refreshLocation')
      .then(() => this.$store.dispatch('getNearbyRooms'))
      .then(() => {
        done();
      }).catch(() => {});
    }
  },
  created() {
    this.isRefreshing = true;
    const geolocationPromise = this.$store.getters.hasGeolocation ? Promise.resolve() : this.$store.dispatch('refreshLocation');
    geolocationPromise
    .then(() => this.$store.dispatch('getNearbyRooms'))
    .then(() => { this.isRefreshing = false; })
    .catch(() => {});
  }
};
</script>

<style scoped lang="stylus">
.no-rooms-padding
  padding-top: 3.5rem
</style>