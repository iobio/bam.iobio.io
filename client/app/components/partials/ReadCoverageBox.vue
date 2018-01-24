<style type="text/css">

  .panel#depth-distribution {
    -webkit-flex: 1 1 auto;
    flex: 1 1 auto;
    -webkit-order: 2;
    order: 2;
    height: 100%;
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

  .hint {
    margin-top: -7px;
    margin-bottom: 10px;
    font-size:13px;
    color:rgb(170,170,170);
  }

  .bedfile-button{
    position:absolute;
    right:15px;
    top:20px;
    font-size:13px;
    color: rgb(60,60,60);
    cursor: pointer;
    border-bottom: 1px solid rgb(180,180,180);
  }

  #bedfile {
    visibility:hidden;
    display:none;
  }

  /* power scale */
  #scale-switch {
    position: absolute;
    top:50px;
    left:16px;
    cursor: pointer;
  }

  .checkbox {padding-left: 18px;}
  .checkbox, .checkbox .icons{
    height: 13px;
    /*line-height: 13px;*/
    font-size: 13px;
  }

  .warning {
    display: none;
    margin-top: 40px;
    background: rgb(120,120,120);
    color: white;
    font-family: arial;
    font-size: 20px;
  }

  .file label {
    float:left;
  }

  .file input {
    position: absolute;
    display: inline-block;
    left: 0;
    top: 0;
    opacity: 0.01;
    visibility:hidden;
    cursor: pointer;
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
</style>

<template>
  <div id="depth-distribution" class="panel">

    <div class="title" >
      <help-button style="font-size:0.45em;vertical-align: 30%" modalTitle="Read coverage" tooltipText="Coverage across the genome"
                   :body="helpBody">
      </help-button>
      Read Coverage
    </div>
    <div class="hint">(drag to select region)</div>

    <input type="file" name="files[]" id="bedfile"  multiple />
    <div id="remove-bedfile-button" class="bedfile-button" onClick="$emit('removeBedFile')" style="visibility:hidden">Remove Bed</div>
    <div id="default-bedfile-button" class="bedfile-button" onClick="$emit('addDefaultBedFile')" title="1000G human exome targets file " style="right:110px">GRCh37 exonic regions</div>
    <label id="add-bedfile-button" class="bedfile-button" for="bedfile" title="Add Bed format capture target definition file">Custom Bed</label>

    <!-- log toggle -->
    <label id="scale-switch" class="checkbox">
      <input type="checkbox" v-model="powerScale" class='power-scale' >
      Power Scale
    </label>

    <div id="readDepthLoadingMsg" style="font-size:50px;margin-top:30px;color:#2687BE">Initializing data <img style="height:18px" src="../../../images/loading_dots.gif"/></div>
    <div class='warning' id="not_enough_data">Bam file is too small to read coverage information</div>
    <div class="warning too-many-refs">Too many references to display. Use the dropdown to the left to select the reference</div>

    <div class='chart' style="width:98%; height:60%"></div>

    <read-coverage-plot @setSelectedSeq="setSelectedSeq"
                        :powerScale="powerScale"></read-coverage-plot>
  </div>
</template>

<script>

import HelpButton from "./HelpButton.vue";
import ReadCoveragePlot from "../viz/ReadCoveragePlot.vue";

export default {
  components: {
    ReadCoveragePlot,
    HelpButton
  },
  name: 'read-coverage-box',
  props: {
  },
  data() {
    return {
      helpBody: "The read coverage shows how the read coverage varies across the entire genome. The coloured " +
                "numbers beneath represent chromosomes in the reference genome used and can be selected to view " +
                "the read coverage in an individual chromosome. Selecting a different chromosome will cause " +
                "all other metrics in bam.iobio to be recalculated based on reads sampled from that chromosome only. " +
                "Once a chromosome is selected, you can also focus on a smaller region by dragging over the region " +
                "of interest; again, all other metrics will then be recalculated for that region only.",
      powerScale: false,
    }
  },

  mounted: function() {
  },

  methods: {

    setSelectedSeq: function( selected, start, end) {
      this.$emit('setSelectedSeq', selected, start, end);
    }

  },

  watch: {
  }
}


</script>

