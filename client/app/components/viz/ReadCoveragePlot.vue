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
        default: 400,
        type: Number
      },
      labels: {},
      height:{
        default: 150,
        type: Number
      },
      width:{
        default: 800,
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
      powerScale:{
        type: Boolean,
      }
    },
    data() {
      return {

      }
    },
    created: function() {

    },
    mounted: function() {
      this.setup();
    },
    methods: {
      setup: function() {
        var self = this;

        var color = d3.scale.category20b();

        window.readDepthChart = iobio.viz.multiLine()
          .nameValue(function(d) { return d.name; })
          .dataValue(function(d) { return d.data; })
          .xValue(function(d,i) { return d.pos; })
          .yValue(function(d,i) { return d.depth; })
          .wValue(function() { return 1; })
          .transitionDuration(self.transitionDuration)
          .epsilonRate(0.3)
          .margin({top: 10, right: 0, bottom: 30, left:0})
          .height(this.height)
          .color(function(d,i) {return color(d.name); })
          .width(this.width)
          .on('click', function(d) {
            var name = d ? d.name : 'all';
            self.setSelectedSeq(name);
          })
          .brush('brushend', function(b) {
            var start = parseInt(b.extent()[0]), end = parseInt(b.extent()[1]);
            if (start != end)
              self.setSelectedSeq( window.readDepthChart.getSelected(), start, end );
            else
              self.setSelectedSeq( window.readDepthChart.getSelected() );
          });

        window.readDepthChart.lineChart().y(d3.scale.pow().exponent(self.yscale));

      },

      setSelectedSeq: function( selected, start, end) {
        this.$emit('setSelectedSeq', selected, start, end);
      },

      update: function() {
        window.readDepthChart.width(this.width);
        window.readDepthChart.lineChart().y(window.readDepthChart.lineChart().y().exponent(this.yscale));

        window.readDepthChart(d3.select('#depth-distribution .chart')); //TODO: ,{ selected: getSelectedSeqId()});

        this.$emit('setSelection',this.selection);
      },
    },
    computed: {
      yscale: function() {
        return this.powerScale ? 0.5 : 1;
      }
    },
    watch: {
      data: function() {
        this.update();
      },
      selection: function() {
        this.update();
      },
      width: function() {
        this.update();
      },
      powerScale: function() {
        this.update();
      }
    }
}


</script>

