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

    data() {
      return {
      }
    },
    mounted: function () {

      if (!this.$route.query.bam) {
        this.$router.push({ name: 'home' });
      }
      else {
        const query = Object.assign({}, this.$route.query);

        this.$router.push({
          name: "alignment-page",
          query,
        });
      }
    },
  }
</script>

