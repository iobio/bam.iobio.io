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
    <div id="value" style="font-size:5.5vw; color:#2687BE; text-align:center;padding-left:8px;">0</div>
    <div id="base" style="font-size:1.4vw;padding-left:28px; letter-spacing:3px; color:#2687BE; text-align:center;">
      <span id="number"></span>
      <img title="Sample More" style="width:20px;margin-bottom:-3px;margin-left:-17px;cursor:pointer"
           @click="sampleMore()" src="../../../images/more_sampling.png"></img>
    </div>
  </div>
</template>

<script>

import HelpButton from "./HelpButton.vue";

export default {
  components: {HelpButton},
  name: 'reads-sampled',
  props: {




  },
  data() {
    return {
      helpBody: "Bam.iobio does not read the entire bam file, rather, it samples reads from across the entire genome. " +
                "The number of reads that have been sampled are shown here, and should be at least in the tens of thousands " +
                "to have confidence in the statistics. Click the arrow beneath the displayed number to increase the number " +
                "of sampled reads."
    }
  },
  methods: {


  },
  computed: {

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

