<template>
  <g>
    <polyline v-if='points' :points="pointStr" :stroke="color" stroke-width="2" fill="none"/>
    <rect v-else class='line-segment__missing-data' :width='width' :height='height'/>
  </g>
</template>

<script>

import pointSmooth from '../../../js/pointSmooth';


export default {
  props: [
    'width', 'height',
    'points', 'color', 'index', 'xAccessFunc', 'yAccessFunc',
    'selected', 'domain', 'range',
  ],
  computed: {
    smoother: function() {
      const points = pointSmooth()
        .size(this.width*this.height/5)
        .epsilonRate(0.1);
      return points;
    },
    smoothed: function() {
      return this.smoother(this.points);
    },
    pointStr: function() {
      return this.processData();
    },
  },
  methods: {
    processData: function() {
      const points = this.smoothed;

      const numSamples = 10;
      let sampleStep = Math.floor(points.length / numSamples);

      let pointStr = "";

      if (sampleStep < 1) {
        sampleStep = 1;
      }

      for (let i = 0; i < points.length; i++) {
        const point = points[i];

        const x = this.xAccessFunc(point);
        const y = this.yAccessFunc(point);

        const spanX = this.domain.max - this.domain.min;
        const screenX = (x / spanX) * this.width;
        const spanY = this.range.max - this.range.min;
        const screenY = ((spanY - y) / spanY) * this.height;

        const transformedPoint = { x: screenX, y: screenY };

        const str = screenX + ',' + screenY;
        pointStr += str + ' ';
      }

      return pointStr;
    },
  },
}
</script>

<style scoped>
.line-segment__missing-data {
  fill: #ccc;
}
</style>
