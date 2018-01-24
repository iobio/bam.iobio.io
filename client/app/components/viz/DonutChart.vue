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
    name: 'donut-chart',
    props: {
      data: {},
      radius: {
        default: 61,
        type: Number
      }
    },
    data() {
      return {
        donutChart: {},
        pie: {}
      }
    },
    created: function() {
    },
    mounted: function() {
      this.pie = d3.layout.pie()
        .sort(null);

      // var width = this.height;
      // var radius = Math.min(width, this.height) / 2;
      this.donutChart = iobio.viz.pie()
        .radius(this.radius)
        .innerRadius(50)
        .color( function(d,i) { if (i==0) return '#2d8fc1'; else return 'rgba(45,143,193,0.2)'; });
    },
    methods: {
        draw: function() {
          var selection = d3.select(this.$el).datum(this.pie(this.data));
          this.donutChart(selection);
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


</script>

