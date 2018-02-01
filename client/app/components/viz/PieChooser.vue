<style type="text/css">
    text { font-size: 11px; font-weight: bold;}

    .iobio-pie .iobio-center-text{text-align:center}
    .iobio-pie .iobio-center-text .iobio-percent{fill:#646464;color:#646464;font-size:23px}
    .iobio-pie .iobio-center-text .iobio-count{font-size:14px;letter-spacing:3px;font-weight:400;color:#969696}
    .iobio-pie text#all-text{fill:#000;font-size:11px}
    .iobio-pie circle#all-circle:hover{fill:#F7F3BA}
    .iobio-pie circle#all-circle.selected{fill:#F7F3BA;stroke-width:1.5px}
    .iobio-pie .arc text{font-size:9px;fill:#fff}

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
    selectedItem: {},
    transitionDuration: {
      default: 50,
      type: Number
    },
    height:{
      default: 220,
      type: Number
    },
    width:{
      default: 220,
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
      pieChooserChart: {},
      pie: {},
    }
  },

  mounted: function() {
    this.setup();
  },

  methods: {
    setup: function() {
      let self = this;

      var color = d3.scale.category20b();

      this.pie = d3.layout.pie()
        .sort(null)
        .value(function(d,i) {return d.data.length });

      this.pieChooserChart = iobio.viz.pieChooser()
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
          self.setSelectedSeq('all');
        })
        .tooltip( function(d) {
          return d.data.name;
        });

    },

    setSelectedSeq: function( selected) {
      this.$emit('setSelectedSeq', selected );
    },

    update: function() {
      var pie = d3.layout.pie()
        .sort(null)
        .value(function(d,i) {return d.data.length });

      var selection = d3.select('#piechooser').datum( pie(this.data) );
      this.pieChooserChart(selection);
    }

  },

  watch: {
    data: function() {
        this.update();
    },

    selectedItem: function() {
      let self = this;
      if ( this.selectedItem == 'all'){
        self.pieChooserChart.clickAllSlices(d3.selectAll('#piechooser .arc')[0]);
      } else {
        $('#piechooser .arc').each(function(i,d) {
          if (d3.select(d).datum().data.name == self.selectedItem) {
            self.pieChooserChart.clickSlice(i);
          }
        });
      }
    }
  }
}


</script>

