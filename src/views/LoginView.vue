<template>
  <div>
    <q-layout>
      <div class="layout-padding text-center">
        <img class="responsive" src="../assets/logo.png" />
        <p class="caption"><h2><strong>Quack</strong></h2></p>
        <p class="caption"><h5>Make chats social again.</h5></p>
      </div>
      <q-btn class="fb-button" icon-right="lock" big v-ripple color="#3B5998" @click="login()">
        Sign in with Facebook
      </q-btn>
    </q-layout>
  </div>
</template>

<script>
import { Ripple, QBtn, QLayout, Loading, QSpinnerCube } from 'quasar-framework';

export default {
  directives: {
    Ripple
  },
  components: {
    QBtn,
    QLayout
  },
  methods: {
    login() {
      Loading.show({
        spinner: QSpinnerCube
      });
      this.$store.dispatch('login')
      .then(() => {
        // Redirect back to where user wanted to go
        this.$router.go(-1);
        Loading.hide();
      });
    }
  }


};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.fb-button
  background-color: #3B5998
</style>
