<style type="text/css">
  .rect rect {
    fill: #d93c3c;
  }

  .inlineLabel {
    fill: #d93c3c;
  }

  /* Axes */
  .iobio-axis path, .iobio-axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
  }

  /* Tooltip */
  .iobio-tooltip {
    position: fixed;
    top:0px;
    text-align: center;
    z-index:20;
    color:white;
    padding: 4px 6px 4px 6px;
    font: 11px arial;
    background: rgb(80,80,80);
    border: 0px;
    border-radius: 4px;
    pointer-events: none;
  }

  /* Brush */
  .iobio-brush .extent {
    stroke: #000;
    fill-opacity: .125;
    shape-rendering: crispEdges;
  }

</style>

<template>
    <div>

    </div>
</template>

<script>

export default {
  name: 'bar-chart',
  props: {
    data: {},
    labels: {},
    height: {
      type: Number,
      default: 100
    },
    width: {
      type: Number,
      default: undefined
    },
    labelFormat: {
      type: Function,
      default: function(label, d, i) {
        return label.name ? label.name + ': ' + label.percentage : '';
      }
    },
    margin: {
      type: Array,
      default: function() {
        return [0, 0, 17, 0];
      }
    },
    xAxis: {
      type: Boolean,
      default: true
    },
    inlineLabel: {
      type: String,
      default: undefined
    },
    inlineLabelWidth: {
      type: Number,
      default: 20
    },
    wValue: {
      type: Function,
      default: function() {
        return 1;
      }
    },
    onBrushEnd: {
      type: Function,
      default: function() { }
    },
    transitionDuration: {
      type: Number,
      default: 50
    }

  },
  data() {
    return {
    }
  },
  created: function() {

  },
  mounted: function() {
    // this.width = this.width || $(this.$el).width();
      this.draw();
  },
  methods: {
    draw: function() {
      var self = this;

      var m = this.finalMargin,
      w = this.svgWidth,
      h = this.height;

      var selection = d3.select(this.$el).datum( self.data );

      this.barChart = iobio.viz.bar()
        .xValue(function(d) { return +d[0]; })
        .yValue(function(d) { return d[1]; })
        .wValue(this.wValue)
        .keyValue(function(d) { return d[0]; })
        .yAxis(null)
        .height(h)
        .transitionDuration(this.transitionDuration)
        .width(w)
        .margin({top: m[0], right: m[1], bottom: m[2], left:m[3]})
        .tooltip(function(d) { return d[0]})
        .brush("brushend", (brush) => this.onBrushEnd(brush.extent()) )
        .brush("brush", this.updateBrush )

      if(!this.xAxis) this.barChart.xAxis(null);

      // note: this line may not be necessary.
      this.barChart( selection );

    },
    updateBrush: function(brush) {
      let svg = d3.select(this.$el).select('svg');
      let g_brush = svg.select('g.iobio-brush');
      let xVals = this.data.map(d => d[0]);

      // Map continuous brush range to discrete bar chart range
      let snapScale = d3.scale.quantize()
        .domain(this.barChart.x().domain())
        .range(xVals);
      let snapBrush = brush.extent().map(snapScale);

      // Update Brush
      g_brush.call((brush.empty()) ? brush.clear() : brush.extent(snapBrush));

      // Fade all years in the histogram not within the brush
      svg.select("g.iobio-bar").selectAll("rect").style("opacity", function(d, i) {
        let dx = d[0];
        return dx >= snapBrush[0] && dx < snapBrush[1] || brush.empty() ? "1" : ".4";
      });

    },
    update: function() {
      this.barChart.width(this.width);
      var selection = d3.select(this.$el).datum(this.data);
      this.barChart(selection);
    }
  },
  computed: {
    svgWidth: function() {
      return this.width || $(this.$el).width();
    },
    finalMargin: function() {
      var m = this.margin;
      return m;
    }
  },
  watch: {
    data: function() {
      this.update();
    },
    width: function() {
      this.update();
    }
  }
}


</script>

