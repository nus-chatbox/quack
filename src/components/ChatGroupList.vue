<template>
  <q-pull-to-refresh :handler="refreshChatGroupList" class="group-list-vert">
    <div v-for="room in nearbyRooms">
      <router-link :to="`/chat/${room.id}`"><chat-group></chat-group></router-link>
    </div>
    <router-link :to="`/chat/1`"><chat-group></chat-group></router-link>
    <router-link :to="`/chat/1`"><chat-group></chat-group></router-link>
    <router-link :to="`/chat/1`"><chat-group></chat-group></router-link>
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
      this.$store.dispatch('getNearbyRooms')
      .then(() => setTimeout(() => { done(); }, 1000))
      // Throw a toast here?
      .catch(() => {});
    }
  },
  created() {
    this.$store.dispatch('getNearbyRooms');
  }
};
</script>

<style scoped lang="stylus">

</style>