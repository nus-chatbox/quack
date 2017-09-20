<template>
  <div id="app">
    <q-transition enter="fadeIn" leave="fadeOut" duration="350">
      <router-view></router-view>
    </q-transition>
  </div>
</template>

<script>
import { QTransition } from 'quasar-framework';
import 'quasar-extras/animate/fadeIn.css';
import 'quasar-extras/animate/fadeOut.css';

export default {
  name: 'app',
  components: {
    QTransition
  }
};
</script>

<style lang="stylus">
@import './style/app.variables'

body
  margin: 0

#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: #2c3e50

</style>
