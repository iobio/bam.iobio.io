<template>
  <g>
    <!--
    <polyline v-if='points' :points="pointStr" :stroke="color" stroke-width="2" fill="none"/>
    -->
    <g v-if='points'>
      <rect v-for='point in screenPoints' :x='point.x' :y='point.y' width='1' :height='point.height' />
    </g>
    <rect v-else class='line-segment__missing-data' :width='width' :height='height'/>
  </g>
</template>

<script>


export default {
  props: [
    'width', 'height',
    'points', 'color', 'index', 'xAccessFunc', 'yAccessFunc',
    'selected', 'domain', 'range',
  ],
  computed: {
    smoother: function() {
      // TODO: make this not depend on the iobio global
      const points = iobio.viz.layout.pointSmooth()
        .size(this.width*this.height/5)
        .epsilonRate(0.1);
      return points;
    },
    smoothed: function() {
      const numBins = this.width;
      if (numBins === 0) {
        return [];
      }

      const samplesPerBin = Math.floor(this.points.length / numBins);

      const smoothed = [];
      for (let i = 0; i < this.points.length; i += samplesPerBin) {

        // TODO: get actual middle point
        const middlePoint = this.points[i];

        let sum = 0;
        for (let j = 0; j < samplesPerBin; j++) {
          sum += this.yAccessFunc(this.points[i]);
        }
        const mean = sum / samplesPerBin;
        smoothed.push({ x: middlePoint.pos, y: mean });
      }

      return smoothed;
      //return this.smoother(this.points);
    },
    pointStr: function() {
      return this.processData();
    },
    screenPoints: function() {
      return this.processData();
    },
  },
  methods: {
    processData: function() {

      console.log(this.index + " points", this.width);
      console.log(this.points);
      console.log("smoothed");
      console.log(this.smoothed);

      const points = this.smoothed;

      //let pointStr = "";
      const screenPoints = [];

      for (let i = 0; i < points.length; i++) {
        const point = points[i];

        //const x = this.xAccessFunc(point);
        //const y = this.yAccessFunc(point);
        const x = point.x;
        const y = point.y;

        const spanX = this.domain.max - this.domain.min;
        const screenX = (x / spanX) * this.width;
        const spanY = this.range.max - this.range.min;
        const screenY = ((spanY - y) / spanY) * this.height;
        //const screenY = (y / spanY) * this.height;

        //const str = screenX + ',' + screenY;

        screenPoints.push({
          x: screenX,
          y: screenY,
          height: this.height - screenY,
        });
        //pointStr += str + ' ';
      }

      console.log("screenPoints");
      console.log(screenPoints);
      return screenPoints;
    },
  },
}
</script>

<style scoped>
.line-segment__missing-data {
  fill: #ccc;
}
</style>
