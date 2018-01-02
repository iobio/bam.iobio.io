<style>
  .panel {
    margin: 20px;
    padding: 5px;
    border: 1px solid rgb(230,230,230);
    border-radius: 2pt;
    text-align: center;
  }

  .panel > .title { font-size: 30px}

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

  #percents .percent {-webkit-flex: 1 1 30%; flex: 1 1 30%; position:relative;}
  #percents .percent svg { width: 100%; height:180px }
  #distributions .distribution {-webkit-flex: 1 1 100%; flex: 1 1 100%; height:200px; position:relative; /*padding: 0px 15px 0px 15px*/}

  .panel#piechooser {
    -webkit-flex: 1 1 250px;
    flex: 1 1 250px;
    -webkit-order: 1;
    order: 1;
    height: 100%;
    position:relative;
    width: 175px;
  }

</style>

<template>
  <div >
    <app-header></app-header>

    <section id="top">

      <div id="piechooser" class="panel">
        <select onchange='setSelectedSeq(this.value);' id="reference-select">
          <option value="all">all</option>
        </select>
      </div>

      <read-coverage :exomeSampling="exomeSampling"></read-coverage>

      <reads-sampled :parentBamView="this" :totalReads="totalReads"></reads-sampled>

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
          <label class="checkbox" for="checkbox2" style="position:absolute;right:10px;top:24px;cursor:pointer" >
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
  import ReadsSampled from "../partials/ReadsSampled.vue";
  import HelpButton from "../partials/HelpButton.vue";
  import ReadCoverage from "../partials/ReadCoverage.vue";
  import Bam from "../../models/Bam.js";
  import NProgress from "../../../js/nprogress";


  export default {
    name: 'bamview',

    components: {
      ReadCoverage,
      HelpButton,
      ReadsSampled,
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
        bam: new Bam().init( this.selectedFileURL ),
        bed: undefined,
        totalReads: 0,
        exomeSampling: false,

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
//        updateTotalReads(0);
        NProgress.start();
        NProgress.set(0);
        // update selected stats
        this.bam.sampleStats( function(data){
          // turn off sampling message
          $(".samplingLoader").css("display", "none");
          $("section#middle svg").css("display", "block");
          this.sampleStats = data;
          // update progress bar
          if (options.start != null && options.end != null) {
            var length = options.end - options.start;
            var percentDone = Math.max(Math.round( ((data.last_read_position-options.start) / length) * 100) / 100,0);
          } else {
            var length = this.bam.header.sq.reduce(function(prev,curr) { if (prev)return prev; if (curr.name == options.sequenceNames[0] )return curr; }, false).end;
            var percentDone = Math.round( (data.last_read_position / length) * 100) / 100;
          }

          if (NProgress.status < percentDone) NProgress.set(percentDone);
          // update charts
          updatePercentCharts(data, this.sampleDonutChart)
//          updateTotalReads(data.total_reads);
          this.totalReads = data.total_reads;
          updateHistogramCharts(data, undefined, "sampleBar")
        },options);
      },

      sampleMore : function() {
        if (sampleMultiplier >= sampleMultiplierLimit) { alert("You've reached the sampling limit"); return;}
        sampleMultiplier += 1;
        var options = {
          sequenceNames : [ getSelectedSeqId() ],
          binNumber : binNumber + parseInt(binNumber/4 * sampleMultiplier),
          binSize : binSize + parseInt(binSize/4 * sampleMultiplier)
        }
        if (this.depthChart.brush().extent().length != 0 && this.depthChart.brush().extent().toString() != "0,0") {
          options.start = parseInt(this.depthChart.brush().extent()[0]);
          options.end = parseInt(this.depthChart.brush().extent()[1]);
        }
        goSampling(options);
      },

      shortenNumber : function(num){
        if(num.toString().length <= 3)
          return [num];
        else if (num.toString().length <= 6)
          return [Math.round(num/1000), "thousand"];
        else
          return [Math.round(num/1000000), "million"];
      },

      updateTotalReads : function(totalReads) {
        // update total reads
        var reads = shortenNumber( totalReads );
        $("#total-reads>#value").html( reads[0] );
        $("#total-reads>#base>#number").html( reads[1] || "" );
      },

      setSelectedSeq: function(selected, start, end) {
        if (selected == 'all') {
          var seqDataIds = Object.keys(this.bam.readDepth)
            .filter(function(key) {
              if (key.substr(0,4) == 'GL00' || key.substr(0,6).toLowerCase() == "hs37d5")
                return false
              if (this.bam.readDepth[key].length > 0)
                return  true
            })
          // setTimeout(function() {
          this.pieChooserChart.clickAllSlices(d3.selectAll('#piechooser .arc')[0]);
          // }, 2000);
        }
        else {
          var seqDataIds = [selected];
          $('#piechooser .arc').each(function(i,d) {
            if (d3.select(d).datum().data.name == selected) {
              // setTimeout(function() {this.pieChooserChart.clickSlice(i);}, 2000);
              this.pieChooserChart.clickSlice(i)
            }

          });

        }

        // this.readDepthChart.trigger('click', selected);
        if(draw) this.readDepthChart.setSelected(selected);

        $("#reference-select").val(selected);

        // reset brush
        resetBrush();
        setUrlRegion({chr:selected, 'start':start, 'end':end });
        // start sampling
        if(start!= undefined && end!=undefined) {
          goSampling({ sequenceNames:seqDataIds, 'start':start, 'end':end });
          setTimeout(function() { setBrush(start,end)}, 200);
        } else {
          goSampling({ sequenceNames:seqDataIds});
        }
      },

      addDefaultBedFile : function() {
        var bedurl = '/20130108.exome.targets.bed';

        // clear brush on read coverage chart
        resetBrush();

        // hide add bed / show remove bed buttons
        $("#add-bedfile-button").css('visibility', 'hidden');
        $("#default-bedfile-button").css('visibility', 'hidden');
        $("#remove-bedfile-button").css('visibility', 'visible');

        // turn on sampling message and off svg
        // turn it on here b\c the bed file is so big it takes a while to download
        $("section#middle svg").css("display", "none");
        $(".samplingLoader").css("display", "block");


        // grab bed from url
//        $.ajax({
//          // XDomainRequest protocol (IE 8 & 9) must be the same scheme as the calling page
//          url: bedurl,
//          dataType: 'text'
//        }).done(function (data) {
//          data = data.replace(/chr/g, '');
//          this.bed = data;
//          goSampling({sequenceNames : getSelectedSeqIds() });
//        });
      }

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

      this.bam = new Bam( bamFile, { bai: baiFile });
      goBam();
    },

    goBam : function(region) {
      $("#selectData").css("display", "none");
      $("#showData").css("visibility", "visible");

      // get read depth
      this.bam.estimateBaiReadDepth(function(id,points, done){
        // setup first time and sample

        if ( Object.keys(this.bam.readDepth).length == 1) {
          // turn off read depth loading msg
          $("#readDepthLoadingMsg").css("display", "none");
          // turn on sampling message
          $(".samplingLoader").css("display", "block");

        }

        var allPoints = Object.keys(this.bam.readDepth)
          .filter(function(key) {
            if (key.substr(0,4) == 'GL00' || key.substr(0,6).toLowerCase() == "hs37d5")
              return false
            if (this.bam.readDepth[key].length > 0)
              return  true
          })
          .map(function(key) {
            return {"name" : key, "data" : this.bam.readDepth[key] }
          })

        draw = true;

        var selection = d3.select('#depth-distribution .chart').datum(allPoints);

        var pie = d3.layout.pie()
          .sort(null)
          .value(function(d,i) {return d.data.length });

        var pieSelection = d3.select('#piechooser').datum( pie(allPoints) )

        if (allPoints.length > 50) {
          $('#piechooser svg').css('visibility', 'hidden');
          $('.too-many-refs').css('display', 'block')
          draw = false;
        }

        if (region && region.chr != 'all') {
          if(draw) this.readDepthChart(selection, {selected:region.chr, noLine:!done});
        }
        else {
          if(draw) this.readDepthChart(selection, {noLine:!done});
        }

        $('#reference-select')
          .append($("<option></option>")
            .attr("value", id)
            .text(id));

        var start = region ? region.start : undefined;
        var end = region ? region.end : undefined;
        // if (region && region.chr == id ) {
        //     this.pieChooserChart(pieSelection);
        //     setSelectedSeq( id, start, end);
        //     //this.readDepthChart(selection, {selected:id});
        // }

        if ( done ) {
          this.pieChooserChart.on('end', function() {
            if (!region || (region && region.chr == 'all'))
              setSelectedSeq( 'all' , start, end );
            else
              setSelectedSeq( id, start, end);
          })
          this.pieChooserChart(pieSelection);
        }

        var totalPoints = allPoints.reduce(function(acc,val) { return acc + val.data.length  },0)
        if (done && totalPoints <= 1) {
          $('#not_enough_data').css('display','block');
        }
      });

    },

    created: function() {
      this.addDefaultBedFile();
//      this.pieChooserChart = iobio.viz.pieChooser()
//        .radius(10)
//        .innerRadius(10*.5)
//        .padding(30)
//        .transitionDuration(0)
//        .color( function(d,i) {
//          return color(d.data.name);
//        })
//        .on("click", function(d,i) {
//          setSelectedSeq(d.data.name);
//        })
//        .on("clickall", function(d,i) {
//          this.readDepthChart.trigger('click', 'all');
//        })
//        .tooltip( function(d) {
//          return d.data.name;
//        });
    }
  }

  function setBrush(start,end) {
//    var brush = window.readDepthChart.brush();
    // // set brush region
//    d3.select("#depth-distribution .iobio-brush").call(brush.extent([start,end]));
  }

  function resetBrush() { setBrush(0,0); }


</script>
