<template>
  <div class='read-depth-chart'>
    <MultiLineChart
      :allPoints='allPoints'
      :xAccessFunc='xAccessFunc'
      :yAccessFunc='yAccessFunc'
      :ids="refIds"
      :offsets='offsets'
      :domains='domains'
      :ranges='ranges'
      :colorFunc='colorFunc'
      :totalLength='totalLength'
      :selectedId="selectedSeqId"
      @setSelectedId='setSelectedId'/>
  </div>
</template>

<script>

import MultiLineChart from './MultiLineChart.vue';
import d3 from 'd3';


export default {
  props: ['references', 'allPoints', 'selectedSeqId'],
  data: function() {
    return {
      refIds: [],
      offsets: [],
      totalLength: 0,
      colorFunc: d3.scale.category20b(),
    };
  },
  components: {
    MultiLineChart,
  },
  computed: {
    domains: function() {
      return this.references.map((ref) => {
        return { min: 0, max: ref.length }; 
      });
    },
    ranges: function() {
      return this.references.map((ref, i) => {
        return { min: 0, max: 4000000 }; 
      });
    },
  },
  watch: {
    // NOTE: I'm using a watcher for this rather than having multiple
    // computed maps over the same array. Maybe there's a better way to do
    // this in Vue.
    references: function() {
      let totalLength = 0;
      const refIds = [];
      const offsets = [];
      for (const ref of this.references) {
        refIds.push(ref.id);
        offsets.push(totalLength);
        totalLength += ref.length;
      }

      this.refIds = refIds;
      this.offsets = offsets;
      this.totalLength = totalLength;

      //this.colorFunc.domain(refIds);
    },
  },
  methods: {
    xAccessFunc: function(elem) {
      return elem.pos;
    },
    yAccessFunc: function(elem) {
      return elem.depth;
    },
    setSelectedId: function(id) {
      this.$emit('setSelectedSeq', id);
    }
  },
}

</script>

<style scoped>
.read-depth-chart {
  width: 100%;
  height: 75%;
}
</style>
