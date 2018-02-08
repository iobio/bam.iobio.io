<style type="text/css">
    text {
      font-size: 11px;
      font-weight: bold;
    }
    .iobio-bar-1 { font-size: 9px;}
    .iobio-bar-1 .instruction {
      font-size: 10px;
    }
    rect {
      fill: #2d8fc1;
      shape-rendering: crispEdges;
    }
    text.axis-label-shadow {
      stroke: white;
      stroke-width: 4px;
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
          // Add labels to both axes, use a white shadow underneath the actual label to use as a background in case
          // the label is over top of data.

          // Select the axis text element, if it exists.
          var svgx = d3.select(this.$el).select("svg").selectAll('.x.axis-label').data([0]);
          var svgy = d3.select(this.$el).select("svg").selectAll('.y.axis-label').data([0]);

          // Otherwise, create axis text element.
          var xsEnter = svgx.enter().append('text').attr('class', 'x axis-label-shadow');
          var xEnter = svgx.enter().append('text').attr('class', 'x axis-label');
          var ysEnter = svgy.enter().append('text').attr('class', 'y axis-label-shadow');
          var yEnter = svgy.enter().append('text').attr('class', 'y axis-label');

          // Label positions
          var xLabelX = $(this.$el).width()/2;//$("#read-coverage-distribution-chart").width() ; //7*this.width/12;
          var xLabelY = this.height * this.sizeRatio - 26;
          var yLabelX = - 5 * this.height * this.sizeRatio / 12;
          var yLabelY = 55;

          // X axis
          d3.select(this.$el).select('.x.axis-label-shadow')
            .attr("text-anchor", "middle")
            .attr("x", xLabelX)
            .attr("y", xLabelY)
            .text(this.xAxisLabel);
          d3.select(this.$el).select('.x.axis-label')
            .attr("text-anchor", "middle")
            .attr("x", xLabelX)
            .attr("y", xLabelY)
            .text(this.xAxisLabel);
          // Y axis
          d3.select(this.$el).select('.y.axis-label-shadow')
            .attr("text-anchor", "middle")
            .attr("y", yLabelY)
            .attr("x",  yLabelX)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text(this.yAxisLabel);
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

