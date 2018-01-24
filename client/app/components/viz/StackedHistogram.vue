<style type="text/css">
    text { font-size: 11px; font-weight: bold;}
    .iobio-bar-1 { font-size: 9px;}
    .iobio-bar-1 .instruction {
      font-size: 10px;
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
        default: 800,
        type: Number
      },
      height: {
        default: 145,
        type: Number
      },
      xTickFormatter: {
        default: tickFormatter(),
        type: Function
      },
      yTickFormatter: {
        default: tickFormatter(),
        type: Function
      },
      margin: {
        default: {top: 5, right: 20, bottom: 20, left: 50}
      },
      sizeRatio: {
        default: 0.8,
        type: Number
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
        .sizeRatio(this.sizeRatio);

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
        }
    },
    watch: {
        data: function() {
            this.update();
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

</script>

