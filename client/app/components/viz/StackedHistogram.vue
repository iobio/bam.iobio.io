<style type="text/css">
    text {
      font-size: 11px;
      font-weight: bold;
    }
    .iobio-bar-1 {
      font-size: 8pt;
      font-weight: bold;
      padding: 0px;
      margin: 0px;
    }
    rect {
      fill: #2d8fc1;
      shape-rendering: crispEdges;
    }
    text.zoom-label {
      font-size: 8pt;
      font-weight: bold;
    }
    text.zoom-label-shadow {
      font-size: 8pt;
      stroke: white;
      stroke-width: 5px;
      font-weight: bold;
    }

</style>

<template>
    <div>

    </div>
</template>

<script>

export default {
    name: 'stacked-histogram',
    props: {
      data: {},
      width: {
        default: 750,
        type: Number
      },
      height: {
        default: 167,
        type: Number
      },
      xTickFormatter: {
        default: tickFormatter,
        type: Function
      },
      yTickFormatter: {
        default: tickFormatter,
        type: Function
      },
      margin: {
        default () {
          return {
            top: 5,
            right: 20,
            bottom: 20,
            left: 50
          }
        },
        type: Object
      },
      sizeRatio: {
        default: 0.72,
        type: Number
      },
      xAxisLabel: {
        default: '',
        type: String
      },
      yAxisLabel: {
        default: '',
        type: String
      }
    },
    data() {
      return {
        histogramChart: {},
      }
    },
    created: function() {
    },
    mounted: function() {

      this.histogramChart = iobio.viz.barViewer()
        .xValue(function(d) { return d[0]; })
        .yValue(function(d) { return d[1]; })
        .wValue(function() { return 1; })
        .height(this.height)
        .width(this.width)
        .margin(this.margin)
        .sizeRatio(this.sizeRatio)
        .tooltip(function(d) { return d[0] + ',' + precisionRound(d[1],2)});

      this.histogramChart.xAxis().tickFormat(this.xTickFormatter);
      this.histogramChart.yAxis().tickFormat(this.yTickFormatter);

    },
    methods: {
      draw: function() {
        var selection = d3.select(this.$el).datum(this.data);
        this.histogramChart(selection);
      },
      update: function() {
        this.draw();
        this.addAxisLabels();
      },
      addAxisLabels: function() {

        // Select x axis and zoom hint divs if they exist.
        var zoomHintDiv = d3.select(this.$el).select(".iobio-bar-1").selectAll('.zoom-label').data([0]);
        var xAxisLabelDiv = d3.select(this.$el).select(".iobio-bar-1").selectAll('.axis-label').data([0]);
        // Otherwise, create the divs.
        var zoomHintEnter = zoomHintDiv.enter().append('div').attr('class', 'zoom-label');
        var xAxisEnter = xAxisLabelDiv.enter().append('div').attr('class', 'x axis-label');

        // Select the y axis label text element, if it exists.
        var chartSVG = d3.select(this.$el).select("svg").selectAll('.y.axis-label').data([0]);
        // Otherwise, create it.
        var yAxisEnter = chartSVG.enter().append('text').attr('class', 'y axis-label');

        // Y axis label positions
        var yLabelX = - 5 * this.height * this.sizeRatio / 12;
        var yLabelY = 6;

        // X axis and zoom hint
        d3.select(this.$el).select('.zoom-label')
          .style("float", "right")
          .style("padding-right","15px")
          .text("(Drag to zoom.)");
        d3.select(this.$el).select('.x.axis-label')
          .style("text-align", "center")
          .style("margin", "0 auto")
          .style("width", "100px")
          .text(this.xAxisLabel);

        // Y Axis
        d3.select(this.$el).select('.y.axis-label')
          .attr("text-anchor", "middle")
          .attr("y", yLabelY)
          .attr("x",  yLabelX)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text(this.yAxisLabel);

      }
    },
    watch: {
        data: function() {
            this.update();
        },
        xAxisLabel: function() {
          this.addAxisLabels();
        },
        yAxisLabel: function() {
          this.addAxisLabels();
        }
    }
}

function tickFormatter (d) {
  if ((d / 1000000) >= 1)
    d = d / 1000000 + "M";
  else if ((d / 1000) >= 1)
    d = d / 1000 + "K";
  return d;
}

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

</script>

