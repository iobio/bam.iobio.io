<style type="text/css">

  .panel#total-reads {
    -webkit-flex: 1 1 150px;
    flex: 1 1 150px;
    -webkit-order: 2;
    order: 2;
    margin-right:20px;
    width: 150px;
  }
</style>

<template>
  <div id="total-reads" class="panel">
    <help-button modalTitle="Sampled reads" tooltipText="Number of reads sampled" :body="helpBody">
    </help-button>
    <div class="title">Reads Sampled</div>
    <div id="value" style="font-size:5.5vw; color:#2687BE; text-align:center;padding-left:8px;">0</div>
    <div id="base" style="font-size:1.4vw;padding-left:28px; letter-spacing:3px; color:#2687BE; text-align:center;">
      <span id="number"></span>
      <img title="Sample More" style="width:20px;margin-bottom:-3px;margin-left:-7px;cursor:pointer" @click="sampleMore()" src="../../../images/more_sampling.png"></img>
    </div>
  </div>
</template>

<script>

import HelpButton from "../partials/HelpButton.vue";

export default {
  components: {HelpButton},
  name: 'reads-sampled',
  props: {
    width: {
      type: Number,
      default: undefined
    },
  },
  data() {
    return {
      helpBody: "Bam.iobio does not read the entire bam file, rather, it samples reads from across the entire genome. " +
                "The number of reads that have been sampled are shown here, and should be at least in the tens of thousands " +
                "to have confidence in the statistics. Click the arrow beneath the displayed number to increase the number " +
                "of sampled reads."
    }
  },
  created: function() {

  },
  mounted: function() {
    // this.width = this.width || $(this.$el).width();
      this.draw();
  },
  methods: {
    sampleMore : function() {
      if (window.sampleMultiplier >= window.sampleMultiplierLimit) { alert("You've reached the sampling limit"); return;}
      window.sampleMultiplier += 1;
      var options = {
        sequenceNames : [ getSelectedSeqId() ],
        binNumber : window.binNumber + parseInt(window.binNumber/4 * window.sampleMultiplier),
        binSize : window.binSize + parseInt(window.binSize/4 * window.sampleMultiplier)
      }
      if (window.depthChart.brush().extent().length != 0 && window.depthChart.brush().extent().toString() != "0,0") {
        options.start = parseInt(window.depthChart.brush().extent()[0]);
        options.end = parseInt(window.depthChart.brush().extent()[1]);
      }
      goSampling(options);
    }
  },
  computed: {
    svgWidth: function() {
      return this.width || $(this.$el).width();
    },
    finalMargin: function() {
      var m = this.margin;
      return m;
    }
  },
  watch: {
    data: function() {
      this.update();
    },
    width: function() {
      this.update();
    }
  }
}


</script>

