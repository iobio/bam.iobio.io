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
      multiplesOfTheMedianToZoom: {
        default: 3,
        type: Number
      }
    },
    data() {
      return {
        readDepthChart: {},
        trimmedYMin: "",
        trimmedYMax: "",
        medianDepth: 0
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
          .margin({top: 10, right: 0, bottom: 30, left:15})
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
        this.addAxisLabels();
      },

      getOptions: function(excludeSelection) {
        var options = {};

        if (!excludeSelection) options.selected = this.selectedSeqId;
        if (isNumeric(this.trimmedYMin) && this.limitYAxes) options.yMin = this.trimmedYMin;
        if (isNumeric(this.trimmedYMax) && this.limitYAxes) options.yMax = this.trimmedYMax;

        return options;
      },

      getBounds: function() {
        var median = d3.median(this.sortedYData);
        var variance = d3.variance(this.sortedYData);
        var sd = Math.sqrt(variance);

        this.medianDepth = median;

        var indices = getIndicesForMediansFrom(this.sortedYData, this.multiplesOfTheMedianToZoom, this.medianDepth);

        this.trimmedYMin = this.sortedYData[indices[0]];
        this.trimmedYMax = this.sortedYData[indices[1]];
      },

      calcMaxZoom: function() {
        // Cut off the max 10 values to avoid the largest outliers
        var maxZoomValue = Math.round((this.sortedYData[this.sortedYData.length-10] - this.medianDepth )/this.medianDepth);
        this.$emit('setMaxZoomValue', maxZoomValue);
      },

      addAxisLabels: function() {
        // Y Axis
        // Select the y axis label text element, if it exists.
        var chartSVG = d3.select(this.$el).select('svg').selectAll('.y.axis-label').data([0]);
        // Otherwise, create it.
        var yAxisEnter = chartSVG.enter().append('text').attr('class', 'y axis-label');

        // Y axis label positions
        var yLabelX = -  this.height / 2;
        var yLabelY = 4;
        // Add the label
        d3.select(this.$el).select('.y.axis-label')
          .attr("text-anchor", "middle")
          .attr("y", yLabelY)
          .attr("x",  yLabelX)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text("Median");
      },

      updateAxisTicks: function() {
        // Clear current axis (otherwise it will redraw on top)
        this.readDepthChart.yAxis().tickFormat(null);
        this.readDepthChart.yAxis().tickValues([]);
        if ( !this.limitYAxes ) {
          // No zoom, only include median
          this.readDepthChart.yAxis().tickValues([this.medianDepth]);
          this.readDepthChart.yAxis().tickFormat(this.tickFormatter);
        } else {
          this.readDepthChart.yAxis().tickValues(Array.from(new Array(10),(val,index)=>this.medianDepth*index));
          this.readDepthChart.yAxis().tickFormat(this.tickFormatter);
        }
      },

      tickFormatter: function(d) {
        // Update tick labels to be in multiples of the median (median = 0)
        if ( isNumeric(d) && this.medianDepth != 0 ){
          var number = Math.floor(Number(d) / this.medianDepth);
          return number - 1;
        }
        return null ;
      },

      setBrush: function (start, end){
        var brush = this.readDepthChart.brush();
        //set brush region
        d3.select("#depth-distribution .iobio-brush").call(brush.extent([start,end]));
      },

      resetBrush: function(){
        this.setBrush(0,0);
      },

      dataUpdate: function(){
        this.getBounds();
        this.calcMaxZoom();
        this.update();
      }

    },
    watch: {
      data: function() {
        this.dataUpdate();
      },
      drawChart: function() {
        this.update();
      },
      selectedSeqId: function() {
        this.dataUpdate();
      },
      width: function() {
        this.update();
      },
      limitYAxes: function() {
        this.updateAxisTicks();
        this.update();
      },
      multiplesOfTheMedianToZoom: function() {
        this.getBounds();
        this.update();
      },
      medianDepth: function() {
        this.updateAxisTicks();
        this.update();
      },

    },
    computed: {
      sortedYData: function(){
        var dataList;

        if (this.selectedSeqId=='all'){
          dataList = Array.from(this.data, d => d.data);
        } else {
          dataList = Array.from(this.data.filter(a => a.name == this.selectedSeqId), d => d.data);
        }
        dataList = [].concat.apply([],dataList);
        var yData = Array.from(dataList, d => d.depth);
        return yData.sort(function(a,b){return a-b});
      },
    }
}

// Get lower and upper index to restrict data to within specified number of multiples of median (or other specified middle value)
function getIndicesForMediansFrom(arr, zoomNumber, middleValue){

  arr = arr.sort(function(a,b){return a-b}); // Data needs to be sorted

  var middle = middleValue ? middleValue : d3.median(arr);  // Use median if no middle value specified

  var startIndex = 0;
  var endIndex = arr.length-1;
  for(var i=0;i<arr.length;++i) {
    if (arr[i] < middle - zoomNumber * middle ){
      startIndex = i;
    }
    if (arr[i] > middle + zoomNumber * middle ){
      endIndex = i;
      break;
    }
  }
  return [startIndex, endIndex];
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


</script>

