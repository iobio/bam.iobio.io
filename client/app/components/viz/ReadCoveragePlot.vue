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


        var binnedMiddleVal = findBinnedMiddle(sortedYData);

        var mean = d3.mean(sortedYData);
        var median = d3.median(sortedYData);
        var variance = d3.variance(sortedYData);
        var sd = Math.sqrt(variance);

        this.medianDepth = binnedMiddleVal;

        var indices = getIndicesForNumberSdsFrom(sortedYData, this.sdsFromTheMedian, this.medianDepth);

        this.trimmedYMin = sortedYData[indices[0]];
        this.trimmedYMax = sortedYData[indices[1]];
      },

      tickFormatter: function(d) {
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
        if ( !this.limitYAxes ) {
          this.readDepthChart.yAxis().tickValues([]);
          this.readDepthChart.yAxis().tickFormat(null);
        } else {
          this.readDepthChart.yAxis().tickValues([0,this.medianDepth,2*this.medianDepth,3*this.medianDepth,4*this.medianDepth,5*this.medianDepth,6*this.medianDepth,7*this.medianDepth,8*this.medianDepth,9*this.medianDepth]);
          this.readDepthChart.yAxis().tickFormat(this.tickFormatter);
        }
        this.update();
      },
      sdsFromTheMedian: function() {
        this.getBounds();
        this.update();
      },
      medianDepth: function() {
        if ( !this.limitYAxes ) {
          this.readDepthChart.yAxis().tickValues([]);
          this.readDepthChart.yAxis().tickFormat(null);
        } else {
          this.readDepthChart.yAxis().tickValues([0,this.medianDepth,2*this.medianDepth,3*this.medianDepth,4*this.medianDepth,5*this.medianDepth,6*this.medianDepth,7*this.medianDepth,8*this.medianDepth,9*this.medianDepth]);
          this.readDepthChart.yAxis().tickFormat(this.tickFormatter);
        }
        this.update();
      }
    }
}

function getIndicesForNumberSdsFrom(arr, numberSds, middleValue){

  arr = arr.sort(function(a,b){return a-b});

  var middle = middleValue ? middleValue : d3.mean(arr);

  var variance = d3.variance(arr);
  var sd = Math.sqrt(variance);

  var startIndex = 0;
  for(var i=0;i<arr.length;++i) {
    if (arr[i] < middle - numberSds * sd ){
      startIndex = i;
      break;
    }
  }
  var endIndex = arr.length-1;
  for(var i=0;i<arr.length;++i) {
    if (arr[i] > middle + numberSds * sd ){
      endIndex = i;
      break;
    }
  }
  return [startIndex, endIndex];
}

function findBinnedMiddle(arr) {
  arr = arr.sort(function(a,b){return a-b});

  var indices = getIndicesForNumberSdsFrom(arr, 3);

  var bins = d3.layout.histogram()
    .range([arr[indices[0]], arr[indices[1]]])
    .bins(50)
    (arr);

  var i, maxIndex = -1, maxY = 0;
  var maxIndices = [];
  for (i = 0; i < bins.length; i += 1 ){
    if ( bins[i].y > maxY ){
      maxY = bins[i].y;
      maxIndex = i;
      maxIndices = [];
      maxIndices.push(i);
    } else if ( bins[i].y == maxY ){
      maxIndices.push(i);
    }
  }
  // Couldn't find a single bin
  if ( maxIndices.length > 1  || maxIndex == -1 ) {
    return -1;
  }

  var maxBin = bins[maxIndex];

  var middleValue = d3.mean([maxBin.x, maxBin.x+maxBin.dx]);
  return middleValue;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


</script>

