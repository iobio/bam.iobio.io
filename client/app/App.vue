<style lang="scss">
  @import '~bootstrap/dist/css/bootstrap.css';
  @import url('https://fonts.googleapis.com/css?family=Quicksand:300');
  @import url('https://fonts.googleapis.com/css?family=Overlock+SC');
  @import url('https://fonts.googleapis.com/css?family=Open+Sans');
  @import url('https://fonts.googleapis.com/css?family=Muli');

  #main {
    margin-top: 40px;
  }
</style>

<template>
  <div id="app">
    <app-header></app-header>
    <div id='main'>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

import AppHeader from "./components/partials/AppHeader.vue";

export default {
  name: 'app',

  components: {
    AppHeader
  },

  mounted: function() {
    if (this.$route.query.source || this.$route.query.bam) {
      this.$router.push({
        name: 'alignment-page',
        query: Object.assign({
          forceReroute: true,
        }, this.$route.query),
      });
    }
  },
}


</script>

