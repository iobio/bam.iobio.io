<style type="text/css">

  .panel#total-reads {
    -webkit-flex: 1 1 150px;
    flex: 1 1 150px;
    -webkit-order: 2;
    order: 2;
    margin-right:20px;
    width: 150px;
    height: 100%;
  }
</style>

<template>
  <div id="total-reads" class="panel">

    <div class="title">
      <help-button style="font-size:0.45em;vertical-align: 30%" modalTitle="Sampled reads"
                   tooltipText="Number of reads sampled" :body="helpBody" >
      </help-button>
      Reads Sampled
    </div>
    <div style="font-size:5.5vw;color:#2687BE;text-align:center;margin-bottom:-11px;margin-top:-11px">
      {{totalReadsValue}}
    </div>
    <div style="font-size:1.4vw;color:#2687BE;text-align:center;">
      {{base}}
      <div >
      <img title="Sample More" style="width:20px;margin-bottom:-3px;cursor:pointer;"
           @click="sampleMore()" src="../../../images/more_sampling.png"></img>
      </div>
    </div>
  </div>
</template>

<script>

import HelpButton from "./HelpButton.vue";

export default {
  components: {HelpButton},
  name: 'reads-sampled',
  props: {
    totalReads : 0,
  },
  data() {
    return {
      helpBody: "Bam.iobio does not read the entire bam file, rather, it samples reads from across the entire genome. " +
                "The number of reads that have been sampled are shown here, and should be at least in the tens of thousands " +
                "to have confidence in the statistics. Click the arrow beneath the displayed number to increase the number " +
                "of sampled reads.",

      totalReadsValue : 0,
      base : "",
    }
  },
  methods: {

    updateTotalReads : function(totalReads) {
      // update total reads
      var reads = shortenNumber( totalReads );
      this.totalReadsValue =  reads[0] ;
      this.base = reads[1] || "" ;
    },

    shortenNumber : function(num) {
      if(num.toString().length <= 3)
        return [num];
      else if (num.toString().length <= 6)
        return [Math.round(num/1000), "thousand"];
      else
        return [Math.round(num/1000000), "million"];
    },

    sampleMore : function() {
      this.$emit('sampleMore');
    }

  },
  computed: {

  },
  watch: {
    totalReads: function(newTotal) {
      this.updateTotalReads(newTotal);
    },
  }
}


</script>

