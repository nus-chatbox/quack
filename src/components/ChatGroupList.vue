<template>
  <q-pull-to-refresh :handler="refreshChatGroupList" class="group-list-vert">
    <div v-for="room in nearbyRooms">
      <router-link :to="`/chat/${room.id}`"><chat-group></chat-group></router-link>
    </div>
  </q-pull-to-refresh>
</template>

<script>
import ChatGroup from '@/components/ChatGroup';
import { QPullToRefresh } from 'quasar-framework';

export default {
  components: {
    ChatGroup,
    QPullToRefresh
  },
  computed: {
    nearbyRooms() {
      return this.$store.state.chat.nearbyRooms;
    }
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
    const geolocationPromise = this.$store.getters.hasGeolocation ? Promise.resolve() : this.$store.dispatch('refreshLocation');
    geolocationPromise
    .then(() => this.$store.dispatch('getNearbyRooms'))
    .then(() => {})
    .catch(() => {});

    this.$store.commit('enterRoom', {
      roomId: 5
    });
  }
};
</script>

<style scoped lang="stylus">

</style>