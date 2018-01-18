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
        default: 875,
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
        var color = d3.scale.category20b();

        var yscale = d3.scale.pow().exponent(1);

        var w = this.svgWidth;

        window.readDepthChart = iobio.viz.multiLine()
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
          .width(w)
          .on('click', function(d) {
            var name = d ? d.name : 'all';
            this.setSelectedSeq(name);
          }.bind(this))
          .brush('brushend', function(b) {
            var start = parseInt(b.extent()[0]), end = parseInt(b.extent()[1]);
            if (start != end)
              this.setSelectedSeq( window.readDepthChart.getSelected(), start, end );
            else
              this.setSelectedSeq( window.readDepthChart.getSelected() );
          }.bind(this));

        window.readDepthChart.lineChart().y(yscale);

        window.readDepthChart(this.selection);

      },
      setSelectedSeq: function( selected, start, end) {
        this.$emit('setSelectedSeq', selected, start, end);
      },
      update: function() {
        window.readDepthChart.width(this.width);
        this.selection = d3.select(this.$el).datum(this.data);
        window.readDepthChart(this.selection);

        this.$emit('setSelection',this.selection);
      },
    },
    computed: {
      svgWidth: function() {
        return this.width || $(this.$el).width();
      },
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
      }
    }
}


</script>

