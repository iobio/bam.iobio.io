<style type="text/css">
    text { font-size: 11px; font-weight: bold;}
</style>

<template>
    <div>

    </div>
</template>

<script>

export default {
    name: 'pie-chooser',
    props: {
      data: {},
      pieSelection: undefined,
      transitionDuration: {
        default: 50,
        type: Number
      },
      labels: {},
      height:{
        default: 250,
        type: Number
      },
      width:{
        default: 250,
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
        radius: this.width/2 - this.padding,
        pieChooser: {}
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

//          var pie = d3.layout.pie()
//            .sort(null)
//            .value(function(d,i) {return d.data.length });
//          var selection = d3.select(this.$el).datum( pie(allPoints) );

        var color = d3.scale.category20b();

        window.pieChooserChart = iobio.viz.pieChooser()
          .radius(this.radius)
          .innerRadius(this.radius*.5)
          .padding(this.padding)
          .transitionDuration(0)
          .color( function(d,i) {
            return color(d.data.name);
          })
          .on("click", function(d,i) {
            setSelectedSeq(d.data.name);
          })
          .on("clickall", function(d,i) {
            window.readDepthChart.trigger('click', 'all');
          })
          .tooltip( function(d) {
            return d.data.name;
          });

        window.pieChooserChart(this.pieSelection);

      },
      update: function() {
        var selection = d3.select(this.$el).datum( self.data );
        window.pieChooserChart(selection);
      },
    },

    watch: {
      data: function() {
          this.update();
      },
      pieSelection: function() {
          this.update();
      }
    }
}


</script>

