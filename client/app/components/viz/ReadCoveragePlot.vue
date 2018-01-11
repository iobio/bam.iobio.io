<style type="text/css">
    text { font-size: 11px; font-weight: bold;}
</style>

<template>
    <div>

    </div>
</template>

<script>

export default {
    name: 'read-coverage-plot',
    props: {
      data: {},
      selection: undefined,
      transitionDuration: {
        default: 50,
        type: Number
      },
      labels: {},
      height:{
        default: 100,
        type: Number
      },
      width:{
        default: 100,
        type: Number
      },
      labelFormat: {
        type: Function,
        default: function(label, d, i) {
          return label.name ? label.name + ': ' + label.percentage : '';
        }
      },
      padding:{
        default: 30,
        type: Number
      },
    },
    data() {
      return {
        lineChart: {}
      }
    },
    created: function() {

    },
    mounted: function() {
      this.draw();
    },
    methods: {
      draw: function() {
        var self = this;

        var yscale = d3.scale.pow().exponent(1);

        this.lineChart = iobio.viz.multiLine()
          .nameValue(function(d) { return d.name; })
          .dataValue(function(d) { return d.data; })
          .xValue(function(d,i) { return d.pos; })
          .yValue(function(d,i) { return d.depth; })
          .wValue(function() { return 1; })
          .transitionDuration(400)
          .epsilonRate(0.3)
          .margin({top: 10, right: 0, bottom: 30, left:0})
          .height(150)
          .color(function(d,i) {return color(d.name); })
          .width(this.width)
          .on('click', function(d) {
            var name = d ? d.name : 'all';
            setSelectedSeq(name);
          })
          .brush('brushend', function(b) {
            var start = parseInt(b.extent()[0]), end = parseInt(b.extent()[1]);
            if (start != end)
              setSelectedSeq( window.readDepthChart.getSelected(), start, end );
            else
              setSelectedSeq( window.readDepthChart.getSelected() );
          });

        this.lineChart.lineChart().y(yscale);

        this.lineChart(selection);

      },
      update: function() {
        this.lineChart(selection);

        this.$emit('setLineChart',this.lineChart);
        this.$emit('setSelection',this.selection);
      },
    },
    watch: {
      data: function() {
        this.update();
      },
      selection: function() {
        this.update();
      }
    }
}


</script>

