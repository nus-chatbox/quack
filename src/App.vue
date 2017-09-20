<template>
  <div id="app">
    <main>
      <q-transition enter="fadeIn" leave="fadeOut" duration="350">
        <router-view></router-view>
      </q-transition>
    </main>
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

main
  text-align: center
  margin-top: 40px

header
  margin: 0
  height: 56px
  padding: 0 16px 0 24px
  background-color: #35495E
  color: #ffffff

header span
  display: block
  position: relative
  font-size: 20px
  line-height: 1
  letter-spacing: .02em
  font-weight: 400
  box-sizing: border-box
  padding-top: 16px

</style>
