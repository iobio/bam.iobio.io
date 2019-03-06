<style lang="scss">
</style>

<template>
  <bam-view
    :selectedBamURL='selectedBamURL'
    :selectedBaiURL='selectedBaiURL'
    :region='region'
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
      regionURLParam: String,
      sampling: '',
    },

    computed: {
      region: function() {
        let region = undefined;
        const regionParam = this.regionURLParam;
        if (regionParam !== undefined) {
          const paramParts = regionParam.split(":");
          if (paramParts.length === 1) {
            region = {
              chr: paramParts[0]
            };
          }
          else {
            const rangeParts = paramParts[1].split('-');
            region = {
              chr: paramParts[0],
              start: parseInt(rangeParts[0]),
              end: parseInt(rangeParts[1])
            };
          }
        }
        return region;
      },
    },

    methods: {
      onRegionChange: function(region) {

        if (region != undefined) {
          let regionStr;

          if (region.start != undefined && region.end != undefined) {
            regionStr = region.chr + ':' + region.start + '-' + region.end;
          } else {
            regionStr = region.chr;
          }

          const query = Object.assign({}, this.$route.query);
          query.region = regionStr;

          this.$router.push({
            name: "alignment-page",
            query, 
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
