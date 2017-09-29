<template>
  <div class="landing-page">
    <q-layout>
      <div class="layout-padding text-center center-piece">
        <img class="responsive logo-width" src="../assets/logo.png" />
        <p class="caption"><h1><strong>Quack</strong></h1></p>
        <p class="caption"><h5 style="font-size:1.35rem">Friends Everywhere.</h5></p>
        <div class="layout-padding">
          <q-btn class="fb-button" icon-right="lock" big v-ripple color="#3B5998" @click="login()">
            Sign in with Facebook
          </q-btn>
        </div>
      </div>

    </q-layout>
  </div>
</template>

<script>
import { Alert, Ripple, QBtn, QLayout, Loading, QSpinnerCube } from 'quasar-framework';

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
        if (this.$store.getters.isLoggedIn) {
          this.$router.go(-1);
        }
        Loading.hide();
      }).catch(() => {
        const alert = Alert.create({
          color: 'negative',
          icon: 'warning',
          html: 'Login was cancelled!',
          duration: 1000,
          enter: 'fadeInDown',
          leave: 'fadeOut',
          position: 'top-center',
          id: 'one',
          dismissible: true
        });
        setTimeout(() => {
          alert.dismiss();
        }, 2000);
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

.landing-page
  background-image: url('/static/img/bg.png')
  background-size: cover

.logo-width
  max-width: 50%

.center-piece
  padding-top: 60px
</style>
