<style type="text/css">
    text { font-size: 11px; font-weight: 300;}
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
      numberIntervalsToZoom: {
        default: 4,
        type: Number
      },
      conversionRatio: {
        type: Number,
        default: 0
      },
      brushRange: {}
    },
    data() {
      return {
        readDepthChart: {},
        trimmedYMin: "",
        trimmedYMax: "",
        medianDepth: 0,
        zoomInterval: 0,
      }
    },
    mounted: function() {
      this.setup();
      window.addEventListener('resize', this.update)
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.update)
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
          .margin({top: 10, right: 0, bottom: 30, left:45})
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

      draw: function() {
        const selection = d3.select('#depth-distribution .chart');

        if (this.drawChart) {
          selection.style('display', 'block');
          this.readDepthChart(selection, this.getOptions());
          this.readDepthChart.setSelected(this.selectedSeqId, this.getOptions(true));
        }
        else {
          selection.style('display', 'none');
        }

        this.setBrush();
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

        this.medianDepth = median;
        var convertedMedian = Math.round(this.medianDepth / this.conversionRatio);
        var indices;

        if ( this.medianDepth && this.medianDepth > 0 && convertedMedian > 5 ) {
          this.$emit('setUseMedianAsZoomInterval',true);
          indices = getIndicesToZoomToIntsFromMiddle(this.sortedYData, this.numberIntervalsToZoom, this.medianDepth, false, this.medianDepth);
        } else {
          this.$emit('setUseMedianAsZoomInterval',false);
          indices = getIndicesToZoomToIntsFromMiddle(this.sortedYData, this.numberIntervalsToZoom, this.medianDepth, true);
        }

        this.trimmedYMin = this.sortedYData[indices[0]];
        this.trimmedYMax = this.sortedYData[indices[1]];
        this.zoomInterval = indices[2];
      },

      calcMaxZoom: function() {
        if ( this.zoomInterval != 0 ) {
          // Cut off the max values to avoid the largest outliers
          var maxZoomValue = Math.round((this.sortedYData[this.sortedYData.length - 6] - this.medianDepth) / this.zoomInterval);
          this.$emit('setMaxZoomValue', maxZoomValue);
        }
      },

      addAxisLabels: function() {
        // Y Axis
        // Select the y axis label text element, if it exists.
        var chartSVG = d3.select("#depth-distribution .chart").select('svg').selectAll('.y.axis-label1').data([0]);
        var chartSVG2 = d3.select("#depth-distribution .chart").select('svg').selectAll('.y.axis-label2').data([0]);
        // Otherwise, create it.
        var yAxisEnter = chartSVG.enter().append('text').attr('class', 'y axis-label1');
        var yAxisEnter2 = chartSVG2.enter().append('text').attr('class', 'y axis-label2');

        // Y axis label positions
        var yLabelX = - 5 * this.height / 12;
        var yLabelY = 4;
        // Title
        d3.select("#depth-distribution .chart").select('.y.axis-label1')
          .attr("text-anchor", "middle")
          .attr("y", yLabelY)
          .attr("x",  yLabelX)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text("Coverage");

        // No conversion ration, show multiples of median instead
        if ( this.conversionRatio == 0 && this.medianDepth != 0 ) {
          var yLabelY2 = 16;

          // Note (line 2)
          d3.select("#depth-distribution .chart").select('.y.axis-label2')
            .attr("text-anchor", "middle")
            .attr("y", yLabelY2)
            .attr("x", yLabelX)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("(multiples of median)");
        } else {
          d3.select("#depth-distribution .chart").select('.y.axis-label2')
            .text(null);
        }
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
          // Update tick labels to be located at multiples of the median
          if ( this.numberIntervalsToZoom >= 9 ) {
            this.readDepthChart.yAxis().tickValues(Array.from(new Array(12), (val, index) => this.zoomInterval * index * 2));
          } else {
            this.readDepthChart.yAxis().tickValues(Array.from(new Array(12), (val, index) => this.zoomInterval * index));
          }
          this.readDepthChart.yAxis().tickFormat(this.tickFormatter);
        }
      },

      tickFormatter: function(d) {
        // Convert to coverage using the conversion ratio
        if ( isNumeric(d) && this.conversionRatio != 0 ){
          var number = Math.floor(Number(d) / this.conversionRatio);
          return number + 'X';
        }
        // No conversion ratio, show multiples of median instead
        else if ( isNumeric(d) && this.zoomInterval != 0 ){
          var number = Math.floor(Number(d) / this.zoomInterval);
          return number;
        }
        return null ;
      },

      setBrush: function (){
       if ( this.brushRange  ) {
          var brush = this.readDepthChart.brush();
          //set brush region
          d3.select("#depth-distribution .iobio-brush").call(brush.extent([this.brushRange.start, this.brushRange.end]));
        }
      },

      update: function() {
        this.updateAxisTicks();
        this.readDepthChart.width(this.width);
        this.draw();
      },

      dataUpdate: function(){
        this.getBounds();
        this.update();
      }

    },
    watch: {
      data: function() {
        this.dataUpdate();
      },
      drawChart: function() {
        this.dataUpdate();
        this.update();
      },
      selectedSeqId: function() {
        this.calcMaxZoom();
        this.dataUpdate();
      },
      width: function() {
        this.update();
      },
      limitYAxes: function() {
        this.update();
      },
      numberIntervalsToZoom: function() {
        this.dataUpdate();
      },
      medianDepth: function() {
        this.update();
      },
      conversionRatio: function() {
        this.calcMaxZoom();
        this.dataUpdate();
      },
      brushRange: {
        handler: function (val, oldVal) {
          this.setBrush();
        },
        deep: true,
      }
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
function getIndicesToZoomToIntsFromMiddle(arr, zoomNumber, middleValue, excludeZeroData, interval){
  var noZerosArr = arr.filter(d => d != 0);

  var middle = middleValue ? middleValue : d3.median(arr);  // Use median if no middle value specified
  var int = interval ? interval : ( excludeZeroData ? d3.deviation(noZerosArr) : d3.deviation(arr));  // Use standard deviation if no middle value specified

  var indices = getIndicesBetweenBounds(arr, middle - zoomNumber * int, middle + zoomNumber * int)

  return [indices[0], indices[1], int];
}

function getIndicesBetweenBounds(arr, lowerBound, upperBound) {
  arr = arr.sort(function(a,b){return a-b}); // Data needs to be sorted

  var startIndex = 0;
  var endIndex = arr.length-1;

  for(var i=0;i<arr.length;++i) {
    if (arr[i] < lowerBound ){
      startIndex = i;
    }
    if (arr[i] > upperBound ){
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

