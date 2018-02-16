<style type="text/css">

  .panel > .title { font-size: 30px}

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
    top:30px;
    left:16px;
    cursor: pointer;
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
  .glyphicon.glyphicon-cog {
    cursor: pointer;
    color: #828282;
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

    <input type="file" name="files[]" id="bedfile"  multiple @change="processBedFile"/>
    <div id="remove-bedfile-button" class="bedfile-button" @click="$emit('removeBedFile')" style="visibility:hidden">Remove Bed</div>
    <div id="default-bedfile-button" class="bedfile-button" @click="$emit('addDefaultBedFile')" title="1000G human exome targets file " style="right:110px">GRCh37 exonic regions</div>
    <label id="add-bedfile-button" class="bedfile-button" for="bedfile" title="Add Bed format capture target definition file">Custom Bed</label>

    <!-- log toggle -->
    <div id="scale-switch"
         class="checkbox"
         v-if="draw"
         style="display: inline-block;vertical-align: middle"
         title="Zoom y axis to better view read coverage data.">
      <input type="checkbox" v-model="limitYAxes" >
      <label for="scale-switch" style="padding-left: 0" @click="limitYAxes=!limitYAxes">
        Zoom y axis
      </label>
      <title class="glyphicon glyphicon-cog"
             style="vertical-align: text-top"
             @click="showZoomModal=true"></title>
      <define-zoom-level-modal v-if="showZoomModal"
                               :sdsFromTheMedianOrig="sdsFromTheMedian"
                               @updateZoom="updateZoom"
                               @close='showZoomModal = false'></define-zoom-level-modal>
    </div>

    <div id="readDepthLoadingMsg" style="font-size:50px;margin-top:30px;color:#2687BE">Initializing data <img style="height:18px" src="../../../images/loading_dots.gif"/></div>
    <div class='warning' id="not_enough_data">Bam file is too small to read coverage information</div>
    <div class="warning too-many-refs">Too many references to display. Use the dropdown to the left to select the reference</div>

    <div class='chart' style="width:98%; height:60%"></div>

    <read-coverage-plot @setSelectedSeq="setSelectedSeq"
                        :selectedSeqId="selectedSeqId"
                        :limitYAxes="limitYAxes"
                        :sdsFromTheMedian="sdsFromTheMedian"
                        :drawChart="draw"
                        :data="readDepthData"></read-coverage-plot>
  </div>
</template>

<script>

import HelpButton from "./HelpButton.vue";
import ReadCoveragePlot from "../viz/ReadCoveragePlot.vue";
import DefineZoomLevelModal from "./DefineZoomLevelModal.vue";


export default {
  components: {
    DefineZoomLevelModal,
    ReadCoveragePlot,
    HelpButton
  },
  name: 'read-coverage-box',
  props: {
    readDepthData: {},
    selectedSeqId: '',
    draw: {
      type: Boolean,
    }
  },
  data() {
    return {
      helpBody: "The read coverage shows how the read coverage varies across the entire genome. The coloured " +
                "numbers beneath represent chromosomes in the reference genome used and can be selected to view " +
                "the read coverage in an individual chromosome. Selecting a different chromosome will cause " +
                "all other metrics in bam.iobio to be recalculated based on reads sampled from that chromosome only. " +
                "Once a chromosome is selected, you can also focus on a smaller region by dragging over the region " +
                "of interest; again, all other metrics will then be recalculated for that region only.",

      limitYAxes: true,
      showZoomModal: false,
      sdsFromTheMedian: Number(3)
    }
  },

  mounted: function() {
  },

  methods: {
    setSelectedSeq: function( selected, start, end) {
      this.$emit('setSelectedSeq', selected, start, end);
    },
    processBedFile: function(event){
      if (event.target.files.length != 1) {
        alert('must select a .bed file');
        return;
      }

      // check file extension
      var fileType = /[^.]+$/.exec(event.target.files[0].name)[0];
      if (fileType != 'bed') {
        alert('must select a .bed file');
        return;
      }

      this.$emit('processBedFile', event.target.files[0]);
    },

    updateZoom: function(sds) {
      this.showZoomModal = false;
      this.sdsFromTheMedian = Number(sds);
    },
  },

  watch: {
  }
}


</script>

