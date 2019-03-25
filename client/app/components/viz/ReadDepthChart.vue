<template>
  <div class='read-depth-chart'>
    <MultiMinibarChart
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
      :average='average'
      :yAxisRange='yAxisRange'
      @setSelectedId='setSelectedId'/>
  </div>
</template>

<script>

import MultiMinibarChart from './MultiMinibarChart.vue';
import d3 from 'd3';


export default {
  name: 'read-depth-chart',
  props: ['references', 'allPoints', 'selectedSeqId', 'conversionRatio',
    'yZoom'],
  data: function() {
    return {
      refIds: [],
      offsets: [],
      totalLength: 0,
      colorFunc: d3.scale.category20b(),
      haveInitialAverage: false,
      average: 0,
    };
  },
  components: {
    MultiMinibarChart,
  },
  computed: {
    domains: function() {
      return this.references.map((ref) => {
        return { min: 0, max: ref.length }; 
      });
    },
    yAxisRange: function() {
      return { min: 0, max: this.range.max / this.conversionRatio }
    },
    yScaleFactor: function() {
      return 1 / this.yZoom;
    },
    range: function() {
      return { min: 0, max: this.average * 3 * this.yScaleFactor };
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
        this.updateAverage();
      }
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
    },
    updateAverage: function() {
      let sum = 0;
      let len = 0;
      // first average
      for (const refPoints of this.allPoints) {
        // entire chromosome might be missing (!refPoints)
        if (refPoints) {
          len += refPoints.length;
          for (const point of refPoints) {
            sum += this.yAccessFunc(point);
          }
        }
      }

      this.haveInitialAverage = true;
      this.average = sum / len;
      //this.$set(this.range, 'max', this.average * 3);
    },
  },
}

</script>

<style scoped>
.read-depth-chart {
  width: 100%;
  height: 75%;
}
</style>
