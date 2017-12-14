<style type="text/css">
  panel#depth-distribution {
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
</template>

<script>

import HelpButton from "../partials/HelpButton.vue";

export default {
  components: {HelpButton},
  name: 'read-coverage',
  props: {
    width: {
      type: Number,
      default: undefined
    },
  },
  data() {
    return {
      helpBody: "The read coverage shows how the read coverage varies across the entire genome. The coloured" +
                "numbers beneath represent chromosomes in the reference genome used and can be selected to view" +
                "the read coverage in an individual chromosome. Selecting a different chromosome will cause" +
                "all other metrics in bam.iobio to be recalculated based on reads sampled from that chromosome only." +
                "Once a chromosome is selected, you can also focus on a smaller region by dragging over the region" +
                "of interest; again, all other metrics will then be recalculated for that region only."
    }
  },
  created: function() {

  },
  mounted: function() {
    // this.width = this.width || $(this.$el).width();
      this.draw();
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

