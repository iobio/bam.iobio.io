<style lang="scss">
</style>

<template>
  <bam-view
    :selectedBamURL='selectedBamURL'
    :selectedBaiURL='selectedBaiURL'
    :regionURLParam='regionURLParam'
    :regionObj='region'
    :sampling='sampling'
    @region-change='onRegionChange'
    @error='onError'
    />
</template>

<script>

  import BamView from "./BamView.vue";

  export default {
    name: 'alignment-page',

    components: {
      BamView,
    },

    props: {
      selectedBamURL: '',
      selectedBaiURL: '',
      regionURLParam: '',
      sampling: '',
    },

    computed: {
      region: function() {
        var region = undefined;
        const regionParam = this.regionURLParam;
        if (regionParam != undefined) {
          if (regionParam.split(":").length == 1)
            region = { chr: regionParam.split(":")[0]}
          else
            region = {
              chr: regionParam.split(":")[0],
              start: parseInt(regionParam.split(":")[1].split('-')[0]),
              end: parseInt(regionParam.split(":")[1].split('-')[1])
            };
        }
        return region;
      },
    },

    methods: {
      onRegionChange: function(region) {

        if (region != undefined) {
          if (region.start != undefined && region.end != undefined) {
            var regionStr = region.chr + ':' + region.start + '-' + region.end;
          } else {
            var regionStr = region.chr;
          }

          var queryParams = {
            bam: this.selectedBamURL,
            region: regionStr};

          if ( this.selectedBaiURL != '') queryParams.bai = this.selectedBaiURL;
          if ( this.sampling != '') queryParams.sampling = this.sampling;

          this.$router.push({
            name: "alignment-page",
            query: queryParams
          });
        }
      },

      onError: function() {
        // if there's an error start over on the home page
        this.$router.push({ path: '/' });
      },
    },
  }

</script>
