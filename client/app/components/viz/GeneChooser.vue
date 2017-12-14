<style type="text/css">
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
  <div id="piechooser" class="panel">
    <select onchange='setSelectedSeq(this.value);' id="reference-select">

      <option value="all">all</option>
    </select>
  </div>
</template>

<script>

import HelpButton from "../partials/HelpButton.vue";

export default {
  components: {HelpButton},
  name: 'gene-chooser',
  props: {
    width: {
      type: Number,
      default: undefined
    },
  },
  data() {
    return {
      helpBody: ""
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

