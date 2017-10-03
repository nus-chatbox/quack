<template>
	<div>
    <q-layout class="static-bg fullscreen">
      <router-link to="/" class="fixed-bottom-right" style="margin-bottom:16px; margin-right:16px">
          <q-btn icon="arrow back" round big v-ripple color="primary">
          </q-btn>
      </router-link>
      <div class="layout-padding">
        <div class="text-center">
          <h4><strong>About Us</strong></h4>
        </div>
        <div class="layout-padding text-center" style="padding-top:1.2rem">
          <img src="/static/img/duck_outline.png" class="responsive" style="max-width:65%"/>

          <p><strong>Quack allows you to connect with people in your surroundings.</strong></p>

          <p>Chat on a topic that is relevant to people around you, using location as the common denominator to get connected.</p>

          <p><strong>Let's get Quacking!</strong></p>
        </div>
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

<style scoped lang="stylus">
.subtitle
  margin-top:25px
  margin-bottom:25px
  font-size:18px
  font-weight: bold

.static-bg
  background-image:url('/static/img/bg.png')
  background-size:cover

p
  font-size: 22px

.fullscreen
  overflow: auto
</style>