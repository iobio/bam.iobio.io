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
    transitionDuration: {
      default: 50,
      type: Number
    },
    height:{
      default: 250,
      type: Number
    },
    width:{
      default: 250,
      type: Number
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

  mounted: function() {
    this.setup();
  },

  methods: {
    setup: function() {
      var self = this;

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
          self.setSelectedSeq(d.data.name);
        })
        .on("clickall", function(d,i) {
          window.readDepthChart.trigger('click', 'all');
        })
        .tooltip( function(d) {
          return d.data.name;
        });

    },

    setSelectedSeq: function( selected) {
      this.$emit('setSelectedSeq', selected );
    },

    update: function() {
      var self = this;
      var selection = d3.select(this.$el).datum( self.data );
      this.pieSelection = selection;
      window.pieChooserChart(this.pieSelection);
    }

  },

  watch: {
    data: function() {
        this.update();
    },
  }
}


</script>

