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
      return this.$store.state.nearbyRooms;
    }
  },
  methods: {
    refreshChatGroupList(done) {
      this.$store.dispatch('refreshLocation').then(() => {
        // Need to update rooms
        return this.$store.dispatch('getNearbyRooms');
      }).then(() => {
        // Throw a toast here?
        done();
      }).catch(() => {
        // Do something on error?
      });
    }
  },
  created() {
    let geolocationPromise = this.$store.getters.hasGeolocation ? Promise.resolve() : this.$store.dispatch('refreshLocation');
    geolocationPromise.then(() => {
      // Show a refreshing symbol here?
      return this.$store.dispatch('getNearbyRooms');
    }).then(() => {
      // Stop showing refreshing symbol?
    }).catch(() => {
      // Do something on error?
    });
  }
};
</script>

<style scoped lang="stylus">

</style>