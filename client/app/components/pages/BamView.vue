<style>
  .panel {
    margin: 20px;
    padding: 5px;
    border: 1px solid rgb(230,230,230);
    border-radius: 2pt;
    text-align: center;
  }

  .panel#piechooser {
    -webkit-flex: 1 1 250px;
    flex: 1 1 250px;
    -webkit-order: 1;
    order: 1;
    height: 100%;
    position:relative;
    width: 250px;
  }

  #percents {
    margin-right: 20px;
    -webkit-flex: 1 1 auto;
    flex: 1 1 auto;
    -webkit-order: 1;
    order: 1;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    flex-direction: row;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    flex-flow: row wrap;
    width: 40%;
  }

  section {
    margin: 0px;
    padding: 0px;
    display: -webkit-flex;
    display:         flex;
    display: -ms-flexbox;
    -webkit-flex-flow: row;
    flex-flow: row;
  }

  section#top {
    min-height: 225px;
    height: 250px;
  }

  section#middle {
    margin-top: 15px;
    min-height: 600px;
  }

  #distributions {
    -webkit-flex: 2 1 auto;
    flex: 2 1 auto;
    -webkit-order: 2;
    order: 2;
    display: -webkit-flex;
    /*                display: flex;*/
    -webkit-flex-direction: row;
    flex-direction: row;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    width: 60%;
  }

  #distributions {
    width: 100%;
  }

  #distributions .distribution {-webkit-flex: 1 1 100%; flex: 1 1 100%; height:200px; position:relative; /*padding: 0px 15px 0px 15px*/}

  .panel#depth-distribution {
    -webkit-flex: 1 1 auto;
    flex: 1 1 auto;
    -webkit-order: 2;
    order: 2;
    height: 250px;
    position:relative;
    width: 65%;
  }

  .panel#depth-distribution .chart {
    -webkit-flex: 1 1 auto;
    flex: 1 1 auto;
    -webkit-order: 2;
    order: 2;
    margin-left: auto;
    margin-right: auto;
  }

  /* Make clicks pass-through */
  #nprogress {
    pointer-events: none;
    -webkit-pointer-events: none;
  }

  #nprogress .bar {
    background: #29d;

    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;

    width: 100%;
    height: 2px;
  }

  /* Fancy blur effect */
  #nprogress .peg {
    display: block;
    position: absolute;
    right: 0px;
    width: 100px;
    height: 100%;
    box-shadow: 0 0 10px #29d, 0 0 5px #29d;
    opacity: 1.0;

    -webkit-transform: rotate(3deg) translate(0px, -4px);
    -moz-transform: rotate(3deg) translate(0px, -4px);
    -ms-transform: rotate(3deg) translate(0px, -4px);
    -o-transform: rotate(3deg) translate(0px, -4px);
    transform: rotate(3deg) translate(0px, -4px);
  }

  /* Remove these to get rid of the spinner */
  #nprogress .spinner {
    display: block;
    position: fixed;
    z-index: 100;
    top: 15px;
    right: 15px;
  }

  #nprogress .spinner-icon {
    width: 14px;
    height: 14px;

    border:  solid 2px transparent;
    border-top-color:  #29d;
    border-left-color: #29d;
    border-radius: 10px;

    -webkit-animation: nprogress-spinner 400ms linear infinite;
    -moz-animation:    nprogress-spinner 400ms linear infinite;
    -ms-animation:     nprogress-spinner 400ms linear infinite;
    -o-animation:      nprogress-spinner 400ms linear infinite;
    animation:         nprogress-spinner 400ms linear infinite;
  }

  .chart rect {
    fill: #2d8fc1;
    shape-rendering: crispEdges;
  }

  .chart rect.unselected {
    fill: #9C9E9F;
  }

  .chart text {
    fill: 'black';
  }

  .iobio-multi-line.line-panel text { fill: black; }
  .iobio-multi-line.button-panel text { fill: white; }

  .iobio-multi-line #iobio-button-all { display: none; }

  .iobio-bar-1 { font-size: 9px;}

  .iobio-bar-1 .instruction {
    font-size: 10px;
  }

  .iobio-axis line,.iobio-axis path{fill:none;stroke:#000;shape-rendering:crispEdges}.iobio-tooltip{position:fixed;top:0;text-align:center;z-index:20;color:#fff;padding:4px 6px;font:11px arial;background:#505050;border:0;border-radius:4px;pointer-events:none}.iobio-brush .extent{stroke:#000;fill-opacity:.125;shape-rendering:crispEdges}
  .iobio-gene .cds,.iobio-gene .utr{fill:#2d8fc1;stroke:#2d8fc1}.iobio-gene .reference{stroke:#969696}.iobio-gene .name{font-size:10px;fill:#787878}.iobio-gene .arrow{stroke:#969696;fill:none}.iobio-gene .iobio-axis line,.iobio-gene .iobio-axis path{fill:none;stroke:#d2d2d2;stroke-width:2px;shape-rendering:crispEdges}.iobio-gene .iobio-axis line{stroke-width:4px}.iobio-gene .iobio-axis text{font-size:11px;fill:#828282}
  .iobio-multi-line #back-ctrl:hover,.iobio-multi-line .button rect:hover{cursor:pointer}.iobio-multi-line .tick text{font-size:10px}.iobio-multi-line .button rect{height:20px}.iobio-multi-line .button text{font-size:10px;pointer-events:none}.iobio-multi-line #back-ctrl{font-size:15px;fill:#1E7DB3}
  path.link{fill:none;stroke:#ccc;stroke-width:1.5px}.above-variant{stroke:red;fill:none}.below-variant{stroke:#00f;fill:none}.reference{fill:gray}

  .samplingLoader {
    font-size:14px;
    color:#2687BE;
    position:absolute;
    width:100%;
    margin-top: 70px;
    margin-left:-6px;
    display:none;
  }
  .samplingLoader img {
    height:9px;
  }

  @-webkit-keyframes nprogress-spinner {
    0%   { -webkit-transform: rotate(0deg);   transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
  }
  @-moz-keyframes nprogress-spinner {
    0%   { -moz-transform: rotate(0deg);   transform: rotate(0deg); }
    100% { -moz-transform: rotate(360deg); transform: rotate(360deg); }
  }
  @-o-keyframes nprogress-spinner {
    0%   { -o-transform: rotate(0deg);   transform: rotate(0deg); }
    100% { -o-transform: rotate(360deg); transform: rotate(360deg); }
  }
  @-ms-keyframes nprogress-spinner {
    0%   { -ms-transform: rotate(0deg);   transform: rotate(0deg); }
    100% { -ms-transform: rotate(360deg); transform: rotate(360deg); }
  }
  @keyframes nprogress-spinner {
    0%   { transform: rotate(0deg);   transform: rotate(0deg); }
    100% { transform: rotate(360deg); transform: rotate(360deg); }
  }

</style>

<template>
  <div >
    <app-header></app-header>

    <section id="top">

      <div id="piechooser" class="panel">
        <pie-chooser @setSelectedSeq="setSelectedSeq"></pie-chooser>
        <select @change="seqSelected" id="reference-select">
          <option value="all">all</option>
        </select>
      </div>

      <read-coverage-box @removeBedFile="removeBedFile()"
                         @addDefaultBedFile="addDefaultBedFile()"
                         @setSelectedSeq="setSelectedSeq"></read-coverage-box>

      <reads-sampled-box @sampleMore="sampleMore" :totalReads="totalReads"></reads-sampled-box>

    </section>

    <section id="middle">
      <div id="percents">

        <percent-chart-box id="mapped_reads"
                           title="Mapped Reads"
                           modal-title="Mapped reads"
                           modal-body=""
                           help-tooltip="Expect a value >90%"
                           :chart-data="mappedReadsData"
                           index-footnote="* full data available in index"></percent-chart-box>

        <percent-chart-box id="forward_strands"
                           title="Forward Strand"
                           modal-title="Forward strand"
                           modal-body=""
                           help-tooltip="Expect a value ~50%"
                           :chart-data="forwardStrandsData"></percent-chart-box>

        <percent-chart-box id="proper_pairs"
                           title="Proper Pairs"
                           modal-title="Proper pairs"
                           modal-body=""
                           help-tooltip="Expect a value >90%"
                           :chart-data="properPairsData"></percent-chart-box>

        <percent-chart-box id="singletons"
                           title="Singletons"
                           modal-title="Singletons"
                           modal-body=""
                           help-tooltip="Expect a value <1%"
                           :chart-data="singletonsData"></percent-chart-box>

        <percent-chart-box id="both_mates_mapped"
                           title="Both Mates Mapped"
                           modal-title="Both mates mapped"
                           modal-body=""
                           help-tooltip="Expect a value >90%"
                           :chart-data="bothMatesData"></percent-chart-box>

        <percent-chart-box id="duplicates"
                           title="Duplicates"
                           modal-title="Duplicates"
                           modal-body=""
                           help-tooltip="Value depends on depth"
                           :chart-data="duplicatesData"></percent-chart-box>
      </div>

      <div id="distributions" >

        <div id="read-coverage-distribution" class="distribution panel">
          Read Coverage Distribution
          <help-button modalTitle="Read Coverage Distribution" tooltipText="Expect a Poisson distribution centered on the expected mean coverage"
                       body="">
          </help-button>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <div id="read-coverage-distribution-chart" class="chart focus" preserveAspectRatio="none" style="width:98%;height:90%"></div>
        </div>

        <div id="length-distribution" class="distribution panel">
          <div>
            <span class="chart-chooser">
              <span class="selected" onclick="toggleChart(this,'lengthChart')" data-outlier="false" data-id="frag_hist">Fragment Length</span> | <span onclick="toggleChart(this,'lengthChart')" data-id="length_hist" data-outlier="true">Read Length</span>
            </span>
          </div>
            <label class="checkbox" style="position:absolute;right:10px;top:24px;cursor:pointer" >
            <input type="checkbox"value="" class="outlier" data-toggle="checkbox" >
            Outliers
          </label>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
            <div id="length-distribution-chart" class="chart focus" preserveAspectRatio="none" style="width:98%;height:85%"></div>
          </div>

        <div id="mapping-quality-distribution" class="distribution panel">
          <div><div class="chart-chooser"><span onclick="toggleChart(this,'qualityChart')" data-id="mapq_hist" class="selected">Mapping Quality</span> | <span data-id="baseq_hist" onclick="toggleChart(this,'qualityChart')">Base Quality</span></div></div>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <div id="mapping-quality-distribution-chart" class="chart focus" preserveAspectRatio="none" style="width:98%;height:90%"></div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>

  import AppHeader from "../partials/AppHeader.vue";
  import ReadsSampledBox from "../partials/ReadsSampledBox.vue";
  import HelpButton from "../partials/HelpButton.vue";
  import ReadCoverageBox from "../partials/ReadCoverageBox.vue";

  import PieChooser from "../viz/PieChooser.vue";

  import DefaultBed from '../../../../data/20130108.exome.targets.bed';
  import DonutChart from "../viz/DonutChart.vue";
  import PercentChartBox from "../partials/PercentChartBox.vue";


  export default {
    name: 'bamview',

    components: {
      PercentChartBox,
      DonutChart,
      PieChooser,
      ReadCoverageBox,
      HelpButton,
      ReadsSampledBox,
      AppHeader
    },

    props: ['selectedFileURL', 'selectedBaiURL'],

    data() {
      return {

        // default sampling values
        samplingBinSize: 40000,
        binNumber: 20,
        binSize: 40000,
        sampleMultiplier: 1,
        sampleMultiplierLimit: 4,
        totalReads: 0,
        sampling: '',

//        bam: new Bam( this.selectedFileURL ),
        bed: {},

        exomeSampling: false,

//        pieChooserChart: {},
//        readDepthChart: {},

        draw: true,

        mappedReadsData: [],
        forwardStrandsData: [],
        properPairsData: [],
        singletonsData: [],
        bothMatesData: [],
        duplicatesData: []

      }
    },

    methods: {

      goSampling : function(options) {
        // add default options
        options = $.extend({
          exomeSampling :  this.exomeSampling, //'checked' == $("#depth-distribution input").attr("checked"),
          bed : this.bed,
          onEnd:function(){NProgress.done();}
        },options);

        // turn on sampling message and off svg
        $("section#middle svg").css("display", "none");
        $(".samplingLoader").css("display", "block");

        this.totalReads = 0;

        NProgress.start();
        NProgress.set(0);

        // update selected stats
        window.bam.sampleStats( function(data){
          // turn off sampling message
          $(".samplingLoader").css("display", "none");
          $("section#middle svg").css("display", "block");
          window.sampleStats = data;
          // update progress bar
          if (options.start != null && options.end != null) {
            var length = options.end - options.start;
            var percentDone = Math.max(Math.round( ((data.last_read_position-options.start) / length) * 100) / 100,0);
          } else {
            var length = window.bam.header.sq.reduce(function(prev,curr) { if (prev)return prev; if (curr.name == options.sequenceNames[0] )return curr; }, false).end;
            var percentDone = Math.round( (data.last_read_position / length) * 100) / 100;
          }

          if (NProgress.status < percentDone) NProgress.set(percentDone);

          // update charts
          this.updatePercentCharts(data, window.sampleDonutChart);
          this.totalReads = data.total_reads;
          this.updateHistogramCharts(data, undefined, "sampleBar");

        }.bind(this),options);
      },

      updatePercentCharts : function(stats, donutChart) {

        var selected = this.getSelectedSeqId();
        var unmappedReads, mappedReads;

        if (selected == 'all') {
          if (window.bam.readDepth[Object.keys(window.bam.readDepth)[0]].mapped != undefined) {
            mappedReads = unmappedReads = 0;
            for ( var id  in window.bam.readDepth) {
              mappedReads += window.bam.readDepth[id].mapped;
              unmappedReads += window.bam.readDepth[id].unmapped;
            }
            unmappedReads = window.bam.n_no_coor;
          }
        } else {
          mappedReads = window.bam.readDepth[selected].mapped;
          unmappedReads = window.bam.readDepth[selected].unmapped;
        }

        var showMappedDataFromIndex = false;
        var brushRange = window.readDepthChart.brush().extent();
        if ( (brushRange == undefined || brushRange.toString() == '0,0' ) && mappedReads != undefined && unmappedReads != undefined) {
          showMappedDataFromIndex = true;
          d3.select("#mapped_reads_chart").selectAll('path')
            .attr('fill', function(d,i) { return i==0 ? 'rgb(9,176,135)' : 'rgba(9,176,135,0.5)' });
          d3.select('.percent .from-index').style('visibility', 'visible');
        } else {
          d3.select('.percent .from-index').style('visibility', 'hidden');
        }

        //update percent charts
        var keys = ['mapped_reads', "proper_pairs", "forward_strands", "singletons", "both_mates_mapped", "duplicates"]

        keys.forEach( function(key,i) {
          var stat = stats[key];
          if (key == 'mapped_reads' && showMappedDataFromIndex) {
            var data = [mappedReads, unmappedReads];
          } else {
            if (stats['total_reads'] == 0)
              var data = [0, 100];
            else
              var data = [stat, stats['total_reads'] - stat];
          }
          if ( key == 'mapped_reads') {
            this.mappedReadsData = data;
          } else if (key == 'forward_strands') {
            this.forwardStrandsData = data;
          } else if ( key == 'proper_pairs') {
            this.properPairsData = data;
          } else if ( key == 'singletons') {
            this.singletonsData = data;
          } else if ( key == 'both_mates_mapped') {
            this.bothMatesData = data;
          } else if ( key == 'duplicates') {
            this.duplicatesData = data;
          }

        }.bind(this));
      },

      updateHistogramCharts : function(histograms, otherMinMax, klass){

        // check if coverage is zero
        if (Object.keys(histograms.coverage_hist).length == 0) histograms.coverage_hist[0] = '1.0';
        // update read coverage histogram
        var d = Object.keys(histograms.coverage_hist).filter(function(i){return histograms.coverage_hist[i] != "0"}).map(function(k) { return [+k, +histograms.coverage_hist[k]] });
        var selection = d3.select("#read-coverage-distribution-chart").datum(d);
        window.readCoverageChart(selection);

        // update read length distribution
        if ($("#length-distribution .selected").attr("data-id") == "frag_hist")
          var d = Object.keys(histograms.frag_hist).filter(function(i){return histograms.frag_hist[i] != "0"}).map(function(k) { return  [+k, +histograms.frag_hist[k]] });
        else
          var d = Object.keys(histograms.length_hist).map(function(k) { return  [+k, +histograms.length_hist[k]] });
        // remove outliers if outliers checkbox isn't explicity checked
        var outliers = $("#length-distribution .checkbox").hasClass("checked");
        if (!outliers) d = iobio.viz.layout.outlier()(d);
        var selection = d3.select("#length-distribution-chart").datum(d);
        window.lengthChart( selection );

        // update map quality distribution
        if ($("#mapping-quality-distribution .selected").attr("data-id") == "mapq_hist")
          var d = Object.keys(histograms.mapq_hist).map(function(k) { return  [+k, +histograms.mapq_hist[k]] });
        else
          var d = Object.keys(histograms.baseq_hist).map(function(k) { return  [+k, +histograms.baseq_hist[k]] });
        var selection = d3.select("#mapping-quality-distribution-chart").datum(d);
        window.qualityChart(selection);

      },

      sampleMore : function() {
        if (this.sampleMultiplier >= this.sampleMultiplierLimit) { alert("You've reached the sampling limit"); return;}
        this.sampleMultiplier += 1;
        var options = {
          sequenceNames : this.getSelectedSeqIds(),
          binNumber : this.binNumber + parseInt(this.binNumber/4 * this.sampleMultiplier),
          binSize : this.binSize + parseInt(this.binSize/4 * this.sampleMultiplier)
        }
        if (window.readDepthChart.brush().extent().length != 0 && window.readDepthChart.brush().extent().toString() != "0,0") {
          options.start = parseInt(this.depthChart.brush().extent()[0]);
          options.end = parseInt(this.depthChart.brush().extent()[1]);
        }
        this.goSampling(options);
      },

      getSelectedSeqId : function() {
        return window.readDepthChart.getSelected();
      },

      getSelectedSeqIds : function() {
        var selected = window.readDepthChart.getSelected();
        if (selected == 'all') {
          return Object.keys(window.bam.readDepth)
            .filter(function(key) {
              if (key.substr(0,4) == 'GL00' || key.substr(0,6).toLowerCase() == "hs37d5")
                return false
              if (window.bam.readDepth[key].length > 0)
                return  true
            })
        } else
          return [selected];
      },

      seqSelected: function (event){
        this.setSelectedSeq(event.target.value);
      },

      setSelectedSeq: function(selected, start, end) {
        if (selected == 'all') {
          var seqDataIds = Object.keys(window.bam.readDepth)
            .filter(function(key) {
              if (key.substr(0,4) == 'GL00' || key.substr(0,6).toLowerCase() == "hs37d5")
                return false
              if (window.bam.readDepth[key].length > 0)
                return  true
            })

          window.pieChooserChart.clickAllSlices(d3.selectAll('#piechooser .arc')[0]);
        }
        else {
          var seqDataIds = [selected];
          $('#piechooser .arc').each(function(i,d) {
            if (d3.select(d).datum().data.name == selected) {
              window.pieChooserChart.clickSlice(i)
            }

          });

        }

        if(this.draw) window.readDepthChart.setSelected(selected);

        $("#reference-select").val(selected);

        // reset brush
        this.resetBrush();
        this.setUrlRegion({chr:selected, 'start':start, 'end':end });
        // start sampling
        if(start!= undefined && end!=undefined) {
          this.goSampling({ sequenceNames:seqDataIds, 'start':start, 'end':end });
          setTimeout(function() { this.setBrush(start,end)}, 200);
        } else {
          this.goSampling({ sequenceNames:seqDataIds});
        }
      },

      setUrlRegion: function(region) {
        if (window.bam.sourceType == 'url' && region != undefined) {
          if (region.start != undefined && region.end != undefined) {
            var regionStr = region.chr + ':' + region.start + '-' + region.end;
          } else {
            var regionStr = region.chr;
          }
          var extraParams = '';
          if (window.sampling) extraParams += '&sampling=' + window.sampling
          if (window.bam.baiUri != undefined) {
            window.history.pushState({'index.html' : 'bar'},null,"?bam=" + encodeURIComponent(window.bam.bamUri) + "&bai=" + encodeURIComponent(window.bam.baiUri) + "&region=" + regionStr + extraParams);

          } else {
            window.history.pushState({'index.html' : 'bar'},null,"?bam=" + encodeURIComponent(window.bam.bamUri) + "&region=" + regionStr + extraParams);
          }
        }
      },

      removeBedFile : function() {
        $("#remove-bedfile-button").css('visibility', 'hidden');
        $("#default-bedfile-button").css('visibility', 'visible');
        $("#add-bedfile-button").css('visibility', 'visible');
        this.bed = undefined;
        this.goSampling({sequenceNames :  this.getSelectedSeqIds() });
      },

      addDefaultBedFile : function() {
        // clear brush on read coverage chart
        this.resetBrush();

        // hide add bed / show remove bed buttons
        $("#add-bedfile-button").css('visibility', 'hidden');
        $("#default-bedfile-button").css('visibility', 'hidden');
        $("#remove-bedfile-button").css('visibility', 'visible');

        // turn on sampling message and off svg
        // turn it on here b\c the bed file is so big it takes a while to download
        $("section#middle svg").css("display", "none");
        $(".samplingLoader").css("display", "block");

        var defaultBed = DefaultBed.replace(/chr/g, '');
        this.bed = defaultBed;
        this.goSampling({sequenceNames : this.getSelectedSeqIds() });
      },

      openBedFile : function(event) {
        if (event.target.files.length != 1) {
          alert('must select a .bed file');
          return;
        }

        // check file extension
        var fileType = /[^.]+$/.exec(event.target.files[0].name)[0];
        if (fileType != 'bed')  {
          alert('must select a .bed file');
          return;
        }
        // clear brush on read coverage chart
        resetBrush();

        // hide add bed / show remove bed buttons
        $("#add-bedfile-button").css('visibility', 'hidden');
        $("#default-bedfile-button").css('visibility', 'hidden');
        $("#remove-bedfile-button").css('visibility', 'visible')

        // read bed file and store
        var reader = new FileReader();
        reader.onload = function(theFile) {
          window.bed = this.result;
          goSampling({sequenceNames : getSelectedSeqIds() });
        }
        reader.readAsText(event.target.files[0])
      },

      openBamFile : function(event) {

        if (event.target.files.length != 2) {
          alert('must select both a .bam and .bai file');
          return;
        }

        var fileType0 = /[^.]+$/.exec(event.target.files[0].name)[0];
        var fileType1 = /[^.]+$/.exec(event.target.files[1].name)[0];

        if (fileType0 == 'bam' && fileType1 == 'bai') {
          bamFile = event.target.files[0];
          baiFile = event.target.files[1];
        } else if (fileType1 == 'bam' && fileType0 == 'bai') {
          bamFile = event.target.files[1];
          baiFile = event.target.files[0];
        } else {
          alert('must select both a .bam and .bai file');
        }

        window.bam = new Bam( bamFile, { bai: baiFile });
        this.goBam();
      },

      goBam : function(region) {
        $("#selectData").css("display", "none");
        $("#showData").css("visibility", "visible");

        // get read depth
        window.bam.estimateBaiReadDepth(function(id,points, done){
          // setup first time and sample

          if ( Object.keys(window.bam.readDepth).length == 1) {
            // turn off read depth loading msg
            $("#readDepthLoadingMsg").css("display", "none");
            // turn on sampling message
            $(".samplingLoader").css("display", "block");

          }

          var allPoints = Object.keys(window.bam.readDepth)
            .filter(function(key) {
              if (key.substr(0,4) == 'GL00' || key.substr(0,6).toLowerCase() == "hs37d5")
                return false
              if (window.bam.readDepth[key].length > 0)
                return  true
            })
            .map(function(key) {
              return {"name" : key, "data" : window.bam.readDepth[key] }
            })

          this.draw = true;

          var selection = d3.select('#depth-distribution .chart').datum(allPoints);

          var pie = d3.layout.pie()
            .sort(null)
            .value(function(d,i) {return d.data.length });

          var pieSelection = d3.select('#piechooser').datum( pie(allPoints) );

          if (allPoints.length > 50) {
            $('#piechooser svg').css('visibility', 'hidden');
            $('.too-many-refs').css('display', 'block');
            this.draw = false;
          }

          if (region && region.chr != 'all') {
            if(this.draw) window.readDepthChart(selection, {selected:region.chr, noLine:!done});
          }
          else {
            if(this.draw) window.readDepthChart(selection, {noLine:!done});
          }

          $('#reference-select')
            .append($("<option></option>")
              .attr("value", id)
              .text(id));

          var start = region ? region.start : undefined;
          var end = region ? region.end : undefined;

          if ( done ) {
            window.pieChooserChart.on('end', function() {
              if (!region || (region && region.chr == 'all'))
                this.setSelectedSeq( 'all' , start, end ); // TODO: anonymous function doesn't know what 'this' is.
              else
                this.setSelectedSeq( id, start, end);
            }.bind(this))
            window.pieChooserChart(pieSelection);
          }

          var totalPoints = allPoints.reduce(function(acc,val) { return acc + val.data.length  },0)
          if (done && totalPoints <= 1) {
            $('#not_enough_data').css('display','block');
          }
        }.bind(this));

      },

      setBrush: function (start, end){
        var brush = window.readDepthChart.brush();
        // set brush region
        d3.select("#depth-distribution .iobio-brush").call(brush.extent([start,end]));
      },

      resetBrush: function(){
        this.setBrush(0,0);
      }

    },

    created: function() {

      // hold onto stats
      window.sampleStats = undefined;

      // HISTOGRAM CHARTS
      var width = 800;//$("#read-coverage-distribution-chart").width();
      var height = 150;//$("#read-coverage-distribution-chart").height();

      // setup read coverage histogram chart
      window.readCoverageChart = iobio.viz.barViewer()
        .xValue(function(d) { return d[0]; })
        .yValue(function(d) { return d[1]; })
        .wValue(function() { return 1; })
        .height(height)
        .width(width)
        .margin({top: 5, right: 20, bottom: 20, left: 50})
        .sizeRatio(0.8);
      window.readCoverageChart.yAxis().tickFormat(function(d) { return d*100 + '%'});

      window.lengthChart = iobio.viz.barViewer()
        .xValue(function(d) { return d[0]; })
        .yValue(function(d) { return d[1]; })
        .wValue(function() { return 1; })
        .height(height)
        .width(width)
        .margin({top: 5, right: 20, bottom: 20, left: 50})
        .sizeRatio(0.8);
      window.lengthChart.xAxis().tickFormat(tickFormatter);
      window.lengthChart.yAxis().tickFormat(tickFormatter);

      // setup quality histogram chart
      window.qualityChart = iobio.viz.barViewer()
        .xValue(function(d) { return d[0]; })
        .yValue(function(d) { return d[1]; })
        .wValue(function() { return 1; })
        .height(height)
        .width(width)
        .margin({top: 5, right: 20, bottom: 20, left: 50})
        .sizeRatio(0.8);
      window.qualityChart.xAxis().tickFormat(tickFormatter);
      window.qualityChart.yAxis().tickFormat(tickFormatter);

      window.bam = new Bam( this.selectedFileURL, { bai: this.selectedBaiFileURL });
      var defaultBed = DefaultBed.replace(/chr/g, '');
      this.bed = defaultBed;
      this.goBam(undefined);
    }

  }

  function tickFormatter (d) {
    if ((d / 1000000) >= 1)
      d = d / 1000000 + "M";
    else if ((d / 1000) >= 1)
      d = d / 1000 + "K";
    return d;
  }

</script>
