<template>
  <div class='multiline-chart' ref='container'>
    <svg class='multiline-chart__svg'>
      <g class='multiline-chart_lines'>
        <g v-for="(points, i) in shownPoints" :key="ids[i]"
          :transform="lineTransform(i)">
          <line-segment
            color="SteelBlue"
            :width='widths[i]'
            :height='lineHeight'
            :index="i"
            :points="shownPoints[i]"
            :xAccessFunc='xAccessFunc'
            :yAccessFunc='yAccessFunc'
            :domain='shownDomains[i]'
            :range='range'
            :selected="ids[i] === selectedId"/>
        </g>
      </g>
      <g v-if='shownPoints.length > 1' class='multiline-chart__buttons'>
        <g v-for='(id, i) in shownIds' :key='shownIds[i]'
            :transform='buttonTransform(i)'>
          <rect class='multiline-chart__button' :width='widths[i]'
            :height='buttonHeight' :style='rectStyle(shownIds[i])' 
            @click='buttonClick(shownIds[i])'/>
          <text class='multiline-chart__button__text' :x='widths[i] / 2'
              y='12' fill='#eee' text-anchor='middle'
              alignment-baseline='middle' >
            {{ shownIds[i] }}
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>

import LineSegment from './LineSegment.vue'

export default {
  props: [
    'xAccessFunc', 'yAccessFunc', 'ids', 'selectedId', 'offsets',
    'domains', 'ranges', 'totalLength', 'allPoints', 'colorFunc',
  ],
  data: function() {
    return {
      width: 0,
      height: 0,
      buttonHeight: 20,
      buttonPadding: 5,
      haveInitialAverage: false,
      range: { min: 0, max: 0 },
    };
  },
  components: {
    LineSegment,
  },
  computed: {
    lineHeight: function() {
      return this.height - (this.buttonHeight + this.buttonPadding);
    },
    shownPoints: function() {
      if (this.selectedId === 'all') {
        return this.ids.map((id, i) => {
          return this.allPoints[i] === undefined ? null : this.allPoints[i];
        });
      }
      else {
        const index = this.indicesForId[this.selectedId];
        return [this.allPoints[index]];
      }
    },
    shownIds: function() {
      if (this.selectedId === 'all') {
        return this.ids;
      }
      else {
        return [this.selectedId];
      }
    },
    shownDomains: function() {
      if (this.selectedId === 'all') {
        return this.domains;
      }
      else {
        const index = this.indicesForId[this.selectedId];
        return [this.domains[index]];
      }
    },
    indicesForId: function(id) {
      const indices = {};
      for (let i = 0; i < this.ids.length; i++) {
        const id = this.ids[i];
        indices[id] = i;
      }
      return indices;
    },
    widths: function() {
      if (this.selectedId === 'all') {
        const widths = [];
        let totalWidth = 0;
        for (let i = 0; i < this.ids.length; i++) {
          const domain = this.domains[i];
          const length = domain.max - domain.min;
          const width = (length / this.totalLength) * this.width;
          totalWidth += width;
          widths.push(width);

          //console.log(length);
        }

        //console.log(widths);
        //console.log("Total width: " + totalWidth);
        //console.log("Total length: " + this.totalLength);
        return widths;
      }
      else {
        // if a single id is selected, it gets allocated all the space
        return [this.width];
      }
    },
  },
  watch: {
    allPoints: function() {

      if (!this.haveInitialAverage) {
        this.haveInitialAverage = true;

        let sum = 0;
        let len = 0;
        // first average
        for (const refPoints of this.allPoints) {
          len += refPoints.length;
          for (const point of refPoints) {
            //console.log("points changed");
            sum += this.yAccessFunc(point);
          }
        }

        const average = sum / len;
        this.range.max = average * 3;
      }
    }
  },
  mounted: function() {
    const dim = this.$refs.container.getBoundingClientRect();
    this.width = dim.width;
    this.height = dim.height;
  },
  methods: {
    lineTransform: function(i) {
      const offsetRatio = this.offsets[i] / this.totalLength;
      const pixelOffset = offsetRatio * this.width;
      //const yOffset = -this.buttonHeight - this.buttonPadding;
      const yOffset = 0;
      return 'translate(' + pixelOffset + ', ' + yOffset + ')';
    },
    buttonTransform: function(i) {
      const offsetRatio = this.offsets[i] / this.totalLength;
      const pixelOffset = offsetRatio * this.width;
      const yOffset = this.height - this.buttonHeight;
      return 'translate(' + pixelOffset + ', ' + yOffset + ')';
    },
    buttonClick: function(id) {
      this.$emit('setSelectedId', id);
    },
    rectStyle: function(id) {
      const color = this.colorFunc(id);
      const rule = "fill: " + color + ";";
      return rule;
    }
  },
}

</script>

<style>
.multiline-chart {
  height: 100%;
}

.multiline-chart__svg {
  width: 100%;
  height: 100%;
}

.multiline-chart__button:hover {
  stroke: red;
  cursor: pointer;
}

.multiline-chart__button__text {
  pointer-events: none;
}

</style>
