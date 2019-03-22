<style lang="scss">
  @import '~bootstrap/dist/css/bootstrap.css';
  @import url('https://fonts.googleapis.com/css?family=Quicksand:300');
  @import url('https://fonts.googleapis.com/css?family=Overlock+SC');
  @import url('https://fonts.googleapis.com/css?family=Open+Sans');
  @import url('https://fonts.googleapis.com/css?family=Muli');
</style>

<template>
  <div id="app">
    <app-header></app-header>
    <router-view></router-view>
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
        query: Object.assign({}, this.$route.query),
      });
    }
    else {
      this.$router.push({
        name: 'home',
        query: Object.assign({}, this.$route.query),
      });
    }
  },
}


</script>

