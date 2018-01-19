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
    width: 175px;
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

  #percents .percent {-webkit-flex: 1 1 30%; flex: 1 1 30%; position:relative;}
  #percents .percent svg { width: 100%; height:180px }

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

  #distributions .distribution {-webkit-flex: 1 1 100%; flex: 1 1 100%; height:200px; position:relative; /*padding: 0px 15px 0px 15px*/}


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
        <pie-chooser :pieSelection="pieSelection"
                     @setSelectedSeq="setSelectedSeq"></pie-chooser>
        <select onchange='setSelectedSeq(this.value);' id="reference-select">
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
        <div id="mapped_reads" class="percent panel">Mapped Reads
          <help-button modalTitle="Mapped reads" tooltipText="Expect a value >90%"
                       body="">
          </help-button>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <svg viewBox="0 0 225 149" preserveAspectRatio="xMidYMid"></svg>
        </div>
        <div id="forward_strands" class="percent panel">Forward Strand
          <help-button modalTitle="Forward strand" tooltipText="Expect a value ~50%"
                       body="">
          </help-button>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <svg viewBox="0 0 225 149" preserveAspectRatio="xMidYMid"></svg>
        </div>
        <div id="proper_pairs" class="percent panel">Proper Pairs
          <help-button modalTitle="Proper Pairs" tooltipText="Expect a value >90%"
                       body="">
          </help-button>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <svg viewBox="0 0 225 149" preserveAspectRatio="xMidYMid"></svg>
        </div>
        <div id="singletons" class="percent panel">Singletons
          <help-button modalTitle="Singletons" tooltipText="Expect a value <1&"
                       body="">
          </help-button>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <svg viewBox="0 0 225 149" preserveAspectRatio="xMidYMid"></svg>
        </div>
        <div id="both_mates_mapped" class="percent panel">Both Mates Mapped
          <help-button modalTitle="Both Mates Mapped" tooltipText="Expect a value >90%"
                       body="">
          </help-button>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <svg viewBox="0 0 225 149" preserveAspectRatio="xMidYMid"></svg>
        </div>
        <div id="duplicates" class="percent panel">Duplicates
          <help-button modalTitle="Duplicates" tooltipText="Value depends on depth"
                       body="">
          </help-button>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <svg viewBox="0 0 225 149" preserveAspectRatio="xMidYMid"></svg>
        </div>
      </div>
      <div id="distributions" >
        <div id="read-coverage-distribution" class="distribution panel"><div>
          Read Coverage Distribution
          <help-button modalTitle="Read Coverage Distribution" tooltipText="Expect a Poisson distribution centered on the expected mean coverage"
                       body="">
          </help-button>
        </div>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <svg id="read-coverage-distribution-chart" class="focus" preserveAspectRatio="none" style="width:98%;height:90%"></svg>
        </div>
        <div id="length-distribution" class="distribution panel">
          <div><div class="chart-chooser"><span class="selected" onclick="toggleChart(this,'lengthChart')" data-outlier="false" data-id="frag_hist">Insert Length</span> | <span onclick="toggleChart(this,'lengthChart')" data-id="length_hist" data-outlier="true">Read Length</span></div></div>
          <label class="checkbox" style="position:absolute;right:10px;top:24px;cursor:pointer" >
            <input type="checkbox"value="" class="outlier" data-toggle="checkbox" >
            Outliers
          </label>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <svg id="length-distribution-chart" class="focus" preserveAspectRatio="none" style="width:98%;height:85%"></svg>
        </div>
        <div id="mapping-quality-distribution" class="distribution panel">
          <div><div class="chart-chooser"><span onclick="toggleChart(this,'qualityChart')" data-id="mapq_hist" class="selected">Mapping Quality</span> | <span data-id="baseq_hist" onclick="toggleChart(this,'qualityChart')">Base Quality</span></div></div>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <svg id="mapping-quality-distribution-chart" class="focus" preserveAspectRatio="none" style="width:98%;height:90%"></svg>
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

  import DefaultBed from '../../../../data/20130108.exome.targets.bed'


  export default {
    name: 'bamview',

    components: {
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
        pieSelection: {},

//        readDepthChart: {},

        draw: true,

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
          this.updatePercentCharts(data, this.sampleDonutChart);

          this.totalReads = data.total_reads;

          this.updateHistogramCharts(data, undefined, "sampleBar");

        }.bind(this),options);
      },

      updatePercentCharts : function() {
//        console.log("Update percent charts");
      },

      updateHistogramCharts : function(){
//        console.log("Update histogram charts");
      },

      sampleMore : function() {
        if (this.sampleMultiplier >= this.sampleMultiplierLimit) { alert("You've reached the sampling limit"); return;}
        this.sampleMultiplier += 1;
        var options = {
          sequenceNames : [ this.getSelectedSeqId() ],
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
      window.bam = new Bam( this.selectedFileURL, { bai: this.selectedBaiFileURL });
      var defaultBed = DefaultBed.replace(/chr/g, '');
      this.bed = defaultBed;
      this.goBam(undefined);
    }

  }

</script>
