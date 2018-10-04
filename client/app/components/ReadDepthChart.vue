<template>
  <div class='read-depth-chart'>
    <MultiLineChart
      v-if='allPoints.length > 0'
      :allPoints='allPoints'
      :xAccessFunc='xAccessFunc'
      :yAccessFunc='yAccessFunc'
      :ids="refIds"
      :offsets='offsets'
      :domains='domains'
      :colorFunc='colorFunc'
      :totalLength='totalLength'
      :selectedId="selectedSeqId"
      :range='range'
      :yAxisRange='yAxisRange'
      @setSelectedId='setSelectedId'/>
  </div>
</template>

<script>

import MultiLineChart from './MultiLineChart.vue';
import d3 from 'd3';


export default {
  name: 'read-depth-chart',
  props: ['references', 'allPoints', 'selectedSeqId', 'conversionRatio'],
  data: function() {
    return {
      refIds: [],
      offsets: [],
      totalLength: 0,
      colorFunc: d3.scale.category20b(),
      range: { min: 0, max: 0 },
      haveInitialAverage: false,
      average: 0,
      yAxisRange: { min: 0, max: 0 },
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
    allPoints: function() {

      if (!this.haveInitialAverage) {

        let sum = 0;
        let len = 0;
        // first average
        for (const refPoints of this.allPoints) {
          len += refPoints.length;
          for (const point of refPoints) {
            sum += this.yAccessFunc(point);
          }
        }

        // TODO: this value was arbitrarily selected.
        const MIN_SAMPLES = 1000;
        if (len > MIN_SAMPLES) {
          this.haveInitialAverage = true;
          this.average = sum / len;
          this.range.max = this.average * 3;
        }
      }
    },
    conversionRatio: function() {
      this.yAxisRange = { min: 0, max: this.range.max / this.conversionRatio };
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
