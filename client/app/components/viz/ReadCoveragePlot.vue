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
      selectedSeqId: '',
      drawChart: {
        type: Boolean,
      },
      transitionDuration: {
        default: 400,
        type: Number
      },
      height:{
        default: 150,
        type: Number
      },
      width:{
        default: 800,
        type: Number
      },
      padding:{
        default: 30,
        type: Number
      },
      limitYAxes:{
        type: Boolean,
      },
      sdsFromTheMedian: {
        default: 3,
        type: Number
      }
    },
    data() {
      return {
        readDepthChart: {},
        trimmedYMin: "",
        trimmedYMax: "",
      }
    },
    mounted: function() {
      this.setup();
    },
    methods: {
      setup: function() {
        let self = this;

        var color = d3.scale.category20b();

        this.readDepthChart = iobio.viz.multiLine()
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
              self.setSelectedSeq( self.readDepthChart.getSelected(), start, end );
            else
              self.setSelectedSeq( self.readDepthChart.getSelected() );
          });

      },

      setSelectedSeq: function( selected, start, end) {
        this.$emit('setSelectedSeq', selected, start, end);
      },

      update: function() {
        this.readDepthChart.width(this.width);
        this.draw();
      },

      draw: function() {
        if (this.drawChart) {
          var selection = d3.select('#depth-distribution .chart');//d3.select(this.$el);//.datum(this.data);
          this.readDepthChart(selection, this.getOptions());
          this.readDepthChart.setSelected(this.selectedSeqId, this.getOptions(true));
        }
      },

      getOptions: function(excludeSelection) {
        var options = {};

        if (!excludeSelection) options.selected = this.selectedSeqId;
        if (isNumeric(this.trimmedYMin) && this.limitYAxes) options.yMin = this.trimmedYMin;
        if (isNumeric(this.trimmedYMax) && this.limitYAxes) options.yMax = this.trimmedYMax;

        return options;
      },

      getBounds: function() {

        var dataList;

        if (this.selectedSeqId=='all'){
          dataList = Array.from(this.data, d => d.data);
        } else {
          dataList = Array.from(this.data.filter(a => a.name == this.selectedSeqId), d => d.data);
        }
        dataList = [].concat.apply([],dataList);
        var sortedYData = Array.from(dataList, d => d.depth);
        sortedYData.sort(function(a,b){return a-b});

        var l = sortedYData.length;
        var sum=0;
        var sumsq = 0;
        for(var i=0;i<sortedYData.length;++i) {
          sum+=sortedYData[i];
          sumsq+=sortedYData[i]*sortedYData[i];
        }
        var mean = sum/l;
        var median = sortedYData[Math.round(l/2)];
        var varience = sumsq / l - mean*mean;
        var sd = Math.sqrt(varience);

        var startIndex = 0;
        for(var i=0;i<sortedYData.length;++i) {
          if (sortedYData[i] < median - this.sdsFromTheMedian * sd ){
            startIndex = i;
            break;
          }
        }
        var endIndex = l-1;
        for(var i=0;i<sortedYData.length;++i) {
          if (sortedYData[i] > median + this.sdsFromTheMedian * sd ){
            endIndex = i;
            break;
          }
        }
        this.trimmedYMin = sortedYData[startIndex];
        this.trimmedYMax = sortedYData[endIndex];
      },

      setBrush: function (start, end){
        var brush = this.readDepthChart.brush();
        //set brush region
        d3.select("#depth-distribution .iobio-brush").call(brush.extent([start,end]));
      },

      resetBrush: function(){
        this.setBrush(0,0);
      }

    },
    watch: {
      data: function() {
        this.getBounds();
        this.update();
      },
      drawChart: function() {
        this.update();
      },
      selectedSeqId: function() {
        this.getBounds();
        this.update();
      },
      width: function() {
        this.update();
      },
      limitYAxes: function() {
        this.update();
      },
      sdsFromTheMedian: function() {
        this.getBounds();
        this.update();
      }
    }
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

</script>

