<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
    }
  },
  mounted: function () {
    // Check for URL query parameters.  If present, forward to bam view.
    let self = this;

    var selectedBamURL = self.$route.query.bam;
    var selectedBaiURL = self.$route.query.bai;
    var region = self.$route.query.region;
    var sampling = self.$route.query.sampling;


    if (selectedBamURL != undefined && selectedBamURL != '') {
      var queryParams = {
        bam: selectedBamURL};

      if ( region != '') queryParams.region = region;
      if ( selectedBaiURL != '') queryParams.bai = selectedBaiURL;
      if ( sampling != '') queryParams.sampling = sampling;

      self.$router.push({
        name: "bam-view",
        query: queryParams});

    }
  },
}
</script>

<style lang="scss">
   @import '~bootstrap/dist/css/bootstrap.css';
   @import url('http://fonts.googleapis.com/css?family=Quicksand:300');
   @import url('http://fonts.googleapis.com/css?family=Overlock+SC');
   @import url('http://fonts.googleapis.com/css?family=Open+Sans');
   @import url('http://fonts.googleapis.com/css?family=Muli');
</style>
