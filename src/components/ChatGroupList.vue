<template>
  <div>
    <router-link :to="{ name: 'ChatView'}"><chat-group></chat-group></router-link>
    <router-link :to="{ name: 'ChatView'}"><chat-group></chat-group></router-link>
    <router-link :to="{ name: 'ChatView'}"><chat-group></chat-group></router-link>
  </div>
</template>

<script>
import ChatGroup from '@/components/ChatGroup';

export default {
  components: {
    ChatGroup
  }

};
</script>

<style scoped lang="stylus">

</style>