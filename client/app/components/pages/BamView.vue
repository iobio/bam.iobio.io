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


</style>

<template>
  <div >
    <app-header></app-header>

    <section id="top">

        <gene-chooser></gene-chooser>

        <read-coverage></read-coverage>

        <reads-sampled></reads-sampled>

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
  import ReadsSampled from "../viz/ReadsSampled.vue";
  import HelpButton from "../partials/HelpButton.vue";
  import ReadCoverage from "../viz/ReadCoverage.vue";
  import GeneChooser from "../viz/GeneChooser.vue";

  export default {
    name: 'bamview',
    components: {
      GeneChooser,
      ReadCoverage,
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

    }
  }
</script>
