<style lang="scss">
</style>

<template>
  <bam-view
    v-if='ready'
    :selectedBamURL='selectedBamURL'
    :selectedBaiURL='selectedBaiURL'
    :region='region'
    :sampling='sampling'
    :backendSource='backendSource'
    @region-change='onRegionChange'
    @error='onError'
    />
</template>

<script>

  import BamView from "./BamView.vue";
  import { createIntegration } from '../../../js/integration';

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
      backendSource: String,
    },

    data: function() {
      return {
        integration: null,
      };
    },

    computed: {
      ready: function() {
        return this.selectedBamURL && this.selectedBamURL.length > 0;
      },

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

    mounted: function () {

      this.integration = createIntegration(this.$route.query);

      this.integration.init().then(() => {

        const query = this.integration.buildQuery();
        const params = this.integration.buildParams();

        this.$router.push({
          name: "alignment-page",
          query, 
          params,
        });
      });
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

          const query = this.integration.buildQuery();
          const params = this.integration.buildParams();

          query.region = regionStr;

          this.$router.push({
            name: "alignment-page",
            query,
            params,
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
