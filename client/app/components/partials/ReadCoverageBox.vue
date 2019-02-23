<style type="text/css">

  .read-coverage-title {
    font-size: 30px
  }

  .panel#depth-distribution {
    -webkit-flex: 1 1 auto;
    flex: 1 1 auto;
    -webkit-order: 2;
    order: 2;
    height: 100%;
    position:relative;
    width: 65%;
  }

  .hint {
    height: 14px;
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
  #zoom-buttons {
    position: absolute;
    top:28px;
    left:52px;
    cursor: pointer;
  }

  .warning {
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
</style>

<template>
  <div id="depth-distribution" class="panel">

    <div class="read-coverage-title" >
      <help-button style="font-size:0.45em;vertical-align: 30%" modalTitle="Read coverage" tooltipText="Coverage across the genome">
        <div slot="body">
          The read coverage shows how the read coverage varies across the entire genome. The coloured
          numbers beneath represent chromosomes in the reference genome used and can be selected to view
          the read coverage in an individual chromosome. Selecting a different chromosome will cause
          all other metrics in bam.iobio to be recalculated based on reads sampled from that chromosome only.
          Once a chromosome is selected, you can also focus on a smaller region by dragging over the region
          of interest; again, all other metrics will then be recalculated for that region only.
        </div>
      </help-button>
      Read Coverage
    </div>
    <div class="hint">
      <div v-show="selectedSeqId!='all'" >(drag to select region)</div>
    </div>

    <input type="file" name="files[]" id="bedfile"  multiple @change="processBedFile"/>
    <div id="remove-bedfile-button" class="bedfile-button" @click="$emit('removeBedFile')" style="visibility:hidden">Remove Bed</div>
    <div id="default-bedfile-button" class="bedfile-button" @click="$emit('addDefaultBedFile')" title="1000G human exome targets file " style="right:100px">GRCh37 Exonic Regions</div>
    <label id="add-bedfile-button" class="bedfile-button" for="bedfile" style="font-weight:300" title="Add Bed format capture target definition file">Custom Bed</label>

    <div id='zoom-buttons' style="display: inline-block;vertical-align: middle">
      <label style="padding-left: 0">
        Zoom y axis
      </label>
      <button @click='zoomOut'>-</button>
      <button @click='zoomIn'>+</button>
    </div>

    <div id="readDepthLoadingMsg" style="font-size:50px;margin-top:30px;color:#2687BE">Initializing data <img style="height:18px" src="../../../images/loading_dots.gif"/></div>
    <div v-if="notEnoughData" class="warning">Bam file is too small to read coverage information</div>
    <div v-if="tooManyRefs" class="warning">Too many references to display. Use the dropdown to the left to select the reference</div>

    <read-depth-chart
      :references='references'
      :allPoints='chartData'
      :selectedSeqId='selectedSeqId'
      :conversionRatio='conversionRatio'
      :yZoom='yZoom'
      @setSelectedSeq='setSelectedSeq'>
    </read-depth-chart>

  </div>
</template>

<script>

import HelpButton from "./HelpButton.vue";
import ReadDepthChart from '../viz/ReadDepthChart.vue';


export default {
  components: {
    ReadDepthChart,
    HelpButton
  },
  name: 'read-coverage-box',
  props: {
    selectedSeqId: '',
    draw: {
      type: Boolean,
    },
    conversionRatio: {
      type: Number,
      default: 0
    },

    chartData: {},
    references: {},
  },
  data() {
    return {
      yZoom: 1,
    }
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
    zoomIn: function() {
      this.yZoom *= 2;
    },
    zoomOut: function() {
      this.yZoom /= 2;
    },
  },
  computed: {
    notEnoughData: function() {
      const totalPoints = this.chartData.reduce(function (acc, val) {
        return acc + val.length
      }, 0);

      return this.draw && totalPoints <= 1;
    },

    tooManyRefs: function() {
      const maxRefs = 50;
      const allSelected = this.selectedSeqId === 'all';
      return allSelected && this.chartData.length > 50;
    },
  },
}

</script>

