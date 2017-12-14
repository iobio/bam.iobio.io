<style>
  .panel {
    margin: 20px;
    padding: 5px;
    border: 1px solid rgb(230,230,230);
    border-radius: 2pt;
    text-align: center;
  }

  .panel > .title { font-size: 30px}

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

  .panel#total-reads {
    -webkit-flex: 1 1 150px;
    flex: 1 1 150px;
    -webkit-order: 3;
    order: 3;
    margin-right:20px;
    width: 150px;
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

  .glyphicon.glyphicon-info-sign {
    cursor: pointer;
    color: #828282;
  }

  .panel#piechooser {
    -webkit-flex: 1 1 250px;
    flex: 1 1 250px;
    -webkit-order: 1;
    order: 1;
    height: 250px;
    position:relative;
    width: 250px;
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
      <div id="depth-distribution" class="panel">

        <div class="title" >
          <help-button style="font-size:0.45em;vertical-align: 30%" modalTitle="Read coverage"
                       body="The read coverage shows how the read coverage varies across the entire genome. The coloured numbers beneath represent chromosomes in the reference genome used and can be selected to view the read coverage in an individual chromosome. Selecting a different chromosome will cause all other metrics in bam.iobio to be recalculated based on reads sampled from that chromosome only. Once a chromosome is selected, you can also focus on a smaller region by dragging over the region of interest; again, all other metrics will then be recalculated for that region only.">
          </help-button>
          Read Coverage
        </div>
        <div class="hint">(drag to select region)</div>
        <!-- <label class="checkbox" for="checkbox2" style="position:absolute;right:15px;top:21px;cursor:pointer" title="Turn on Exome Sampling - use the read coverage data to sample only regions with non-zero read depth">
            <input type="checkbox"value="" class="outlier" data-toggle="checkbox" >
            Exome
        </label> -->
        <input type="file" name="files[]" id="bedfile"  multiple />
        <div id="remove-bedfile-button" class="bedfile-button" @click="removeBedFile()" style="visibility:hidden">Remove Bed</div>
        <div id="default-bedfile-button" class="bedfile-button" @click="addDefaultBedFile()" title="1000G human exome targets file " style="right:110px">Default Bed</div>
        <label id="add-bedfile-button" class="bedfile-button" for="bedfile" title="Add Bed format capture target definition file">Custom Bed</label>
        <div id="readDepthLoadingMsg" style="font-size:50px;margin-top:30px;color:#2687BE">Initializing data <img style="height:18px" src="../../../images/loading_dots.gif"/></div>
        <!-- <ul id="sequences"></ul> -->
      </div>

      <reads-sampled>

      </reads-sampled>

    </section>

    <section id="middle">
      <div id="percents">
        <div id="mapped_reads" class="percent panel">Mapped Reads
          <help-button modalTitle="Mapped reads"
                       body="">
          </help-button>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <svg viewBox="0 0 225 149" preserveAspectRatio="xMidYMid"></svg>
        </div>
        <div id="forward_strands" class="percent panel">Forward Strand
          <help-button modalTitle="Forward strand"
                       body="">
          </help-button>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <svg viewBox="0 0 225 149" preserveAspectRatio="xMidYMid"></svg>
        </div>
        <div id="proper_pairs" class="percent panel">Proper Pairs
          <help-button modalTitle="Proper Pairs"
                       body="">
          </help-button>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <svg viewBox="0 0 225 149" preserveAspectRatio="xMidYMid"></svg>
        </div>
        <div id="singletons" class="percent panel">Singletons
          <help-button modalTitle="Singletons"
                       body="">
          </help-button>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <svg viewBox="0 0 225 149" preserveAspectRatio="xMidYMid"></svg>
        </div>
        <div id="both_mates_mapped" class="percent panel">Both Pairs Mapped
          <help-button modalTitle="Both Pairs Mapped"
                       body="">
          </help-button>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <svg viewBox="0 0 225 149" preserveAspectRatio="xMidYMid"></svg>
        </div>
        <div id="duplicates" class="percent panel">Duplicates
          <help-button modalTitle="Duplicates"
                       body="">
          </help-button>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <svg viewBox="0 0 225 149" preserveAspectRatio="xMidYMid"></svg>
        </div>
      </div>
      <div id="distributions" >
        <div id="read-coverage-distribution" class="distribution panel"><div>
          Read Coverage Distribution
          <help-button modalTitle="Read Coverage Distribution"
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
  import ReadsSampled from "../viz/ReadsSampled.vue";
  import HelpButton from "../partials/HelpButton.vue";

  export default {
    name: 'bamview',
    components: {
      HelpButton,
      ReadsSampled,
      AppHeader
    },
    props: ['selectedFileURL', 'selectedBaiURL'],
    data() {
      return {
      }
    },
    methods: {

      removeBedFile : function() {
        $("#remove-bedfile-button").css('visibility', 'hidden');
        $("#default-bedfile-button").css('visibility', 'visible');
        $("#add-bedfile-button").css('visibility', 'visible');
        window.bed = undefined;
        goSampling({sequenceNames : [ getSelectedSeqId() ]});
      },

      addDefaultBedFile : function() {
        var bedurl = 'http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/exome_pull_down_targets/20130108.exome.targets.bed';

        // clear brush on read coverage chart
        window.readCoverageChart.setBrush([0,0]);

        // hide add bed / show remove bed buttons
        $("#add-bedfile-button").css('visibility', 'hidden');
        $("#default-bedfile-button").css('visibility', 'hidden');
        $("#remove-bedfile-button").css('visibility', 'visible');

        // turn on sampling message and off svg
        // turn it on here b\c the bed file is so big it takes a while to download
        $("section#middle svg").css("display", "none");
        $(".samplingLoader").css("display", "block");

        // grab bed from url
        $.ajax({
          // XDomainRequest protocol (IE 8 & 9) must be the same scheme as the calling page
          url: bedurl,
          dataType: 'text'
        }).done(function (data) {
          data = data.replace(/chr/g, '');
          window.bed = data;
          goSampling({sequenceNames : [ getSelectedSeqId() ]});
        });

      }


    }
  }
</script>
