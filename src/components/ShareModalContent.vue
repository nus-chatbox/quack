<template>
    <social-sharing inline-template>
    <table style="cursor: pointer">
        <tr>
            <network network="facebook">
            <i class="fa fa-fw fa-facebook"></i>
            <img src="../assets/fbicon.png" style="width: 10%"/>
            Facebook
            </network>
        </tr>
        <br>
        <tr>
            <network network="googleplus">
            <i class="fa fa-fw fa-google-plus"></i>
            <img src="../assets/gicon.png" style="width: 10%"/>
            Google +
            </network>
        </tr>
        <br>
        <tr>
            <network network="twitter">
            <i class="fa fa-fw fa-twitter"></i>
            <img src="../assets/ticon.png" style="width: 10%"/>
            Twitter
            </network>
        </tr>
        <br>
        <tr>
            <network network="weibo">
            <i class="fa fa-weibo"></i>
            <img src="../assets/wbicon.png" style="width: 10%"/>
            Weibo
            </network>
        </tr>
        <br>
    </table>
    </social-sharing>
</template>

<script>
export default {
  components: {
  },
  computed: {
  },
  methods: {
  }
};
</script>

<style scoped lang="stylus">

</style>