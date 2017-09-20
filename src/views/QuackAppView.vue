<template>
  <div>
    <q-layout>
      <div class="layout-padding text-center">
        <p class="caption"><h2><strong>Welcome to Quack</strong></h2></p>
      </div>
    </q-layout>
  </div>
</template>

<script>
import { Ripple, QBtn, QLayout } from 'quasar-framework';

export default {
  directives: {
    Ripple
  },
  components: {
    QBtn,
    QLayout
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
</style>
