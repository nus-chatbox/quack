<template>
  <div>
    <q-layout>
      <div class="layout-padding text-center">
        <p class="caption"><h2><strong>Oops! Looks like you lost your way.</strong></h2></p>
        <router-link to="/">
          <div class="layout-padding">
            <q-btn icon-right="child care" big v-ripple color="primary">
              Back to Quacking
            </q-btn>
          </div>
        </router-link>
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
