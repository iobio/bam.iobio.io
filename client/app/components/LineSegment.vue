<template>
  <g>
    <polyline v-if='points' :points="pointStr" :stroke="color" stroke-width="2" fill="none"/>
    <rect v-else class='line-segment__missing-data' :width='width' :height='height'/>
  </g>
</template>

<script>

import pointSmooth from './pointSmooth';

function timeNowSeconds() {
  return performance.now() / 1000;
}


export default {
  props: [
    'width', 'height',
    'points', 'color', 'index', 'xAccessFunc', 'yAccessFunc',
    'selected', 'domain', 'range',
  ],
  data: function() {
    return {
      //xMin: Number.MAX_SAFE_INTEGER,
      //xMax: 0,
      //yMin: Number.MAX_SAFE_INTEGER,
      //yMax: 0,
      prevXMax: 0,
      prevYMax: 0,
      //pointStr: '',
    }
  },
  computed: {
    //sampled: function() {

    //  const startTime = timeNowSeconds();

    //  const numSamples = 100;
    //  const sampleStep = Math.floor(this.points.length / numSamples);

    //  const points = [];

    //  for (let i = 0; i < this.points.length; i += sampleStep) {
    //    points.push(this.points[i]);
    //  }

    //  this._sampleTime = timeNowSeconds() - startTime;
    //  return points;
    //},
    smoother: function() {
      const startTime = timeNowSeconds();
      //return (points) => points;
      const points = pointSmooth()
        .size(this.width*this.height/5)
        //.pos((d, i) => d.x)
        //.depth((d, i) => d.y)
        .epsilonRate(0.1);
      this._smootherTime = timeNowSeconds() - startTime;
      return points;
    },
    smoothed: function() {
      const startTime = timeNowSeconds();
      //const s = this.smoother(this.transformedPoints);
      //console.log(this.points);
      const s = this.smoother(this.points);
      //console.log("Full length: " + this.points.length);
      //console.log("Smooth length: " + s.length);
      this._smoothedTime = timeNowSeconds() - startTime;
      return s;
    },
    //transformedPoints: function() {
    //  const startTime = timeNowSeconds();

    //  //for (const point of this.smoothed) {
    //  //  const x = this.xAccessFunc(point);
    //  //  const y = this.yAccessFunc(point);

    //  //  if (x < this.xMin) {
    //  //    this.xMin = x
    //  //  }
    //  //  if (x > this.xMax) {
    //  //    this.xMax = x
    //  //  }

    //  //  if (y < this.yMin) {
    //  //    this.yMin = y
    //  //  }
    //  //  if (y > this.yMax) {
    //  //    this.yMax = y
    //  //  }
    //  //}

    //  //const t = this.smoothed.map((point) => {
    //  console.log(this.sampled);
    //  //const t = this.sampled.map((point) => {
    //  const t = this.points.map((point) => {
    //    const x = this.xAccessFunc(point);
    //    const y = this.yAccessFunc(point);

    //    const spanX = this.domain.max - this.domain.min;
    //    const screenX = (x / spanX) * this.width;
    //    const spanY = this.range.max - this.range.min;
    //    const screenY = ((spanY - y) / spanY) * this.height;

    //    return { x: screenX, y: screenY }
    //  })

    //  const endTime = timeNowSeconds();
    //  //console.log(`Time: ${endTime - startTime}, ${this.index}`);
    //  this._tTime = endTime - startTime;
    //  return t;
    //},
    //joinedPoints: function() {
    //  const startTime = timeNowSeconds();
    //  const joined = this.transformedPoints.map((point) => point.x + ',' + point.y).join(' ');
    //  this._joinedTime = timeNowSeconds() - startTime;
    //  return joined;
    //},
    pointStr: function() {
      return this.processData();
    },
  },
  beforeUpdate: function() {
    this._beforeUpdateTime = timeNowSeconds();
  },
  updated: function() {
    //const updateTime = timeNowSeconds() - this._beforeUpdateTime;
    //const fullTime = this._smootherTime + this._smoothedTime + this._tTime + this._joinedTime;
    //const fullTime = this._sampleTime + this._tTime + this._joinedTime;
    //console.log("_smootherTime: " + this._smootherTime);
    //console.log("_smoothedTime: " + this._smoothedTime);
    //console.log("_tTime: " + this._tTime);
    //console.log("_joinedTime: " + this._joinedTime);
    //console.log("_sampleTime: " + this._sampleTime);
    //console.log("Full update time: " + this._pointStrTime);
  },
  methods: {
    processData: function() {
      //const points = this.points;
      const points = this.smoothed;
      //console.log(points);
      const startTime = timeNowSeconds();

      const numSamples = 10;
      let sampleStep = Math.floor(points.length / numSamples);

      let pointStr = "";

      if (sampleStep < 1) {
        sampleStep = 1;
      }

      //for (let i = 0; i < points.length; i += sampleStep) {
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

      //console.log("pointStr time: " + (timeNowSeconds() - startTime));

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
