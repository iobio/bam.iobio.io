<style>
  #bodydiv {
    font-family: Quicksand;
    font-weight: 300;
    width: 100% ;
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

  .panel > .title { font-size: 30px}

  #percents .percent {-webkit-flex: 1 1 30%; flex: 1 1 30%; position:relative;}
  #percents .percent svg { width: 100%; height:180px }
  #distributions .distribution {-webkit-flex: 1 1 100%; flex: 1 1 100%; height:220px; position:relative; /*padding: 0px 15px 0px 15px*/}

  .bar rect {
    fill: #2d8fc1;
    shape-rendering: crispEdges;
  }

  .bar rect.unselected {
    fill: #9C9E9F;
  }

  .bar text {
    fill: 'black';
  }

  .axis path, .axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
  }

  .avg line {
    z-index: 10;
    stroke: rgb(60,60,60);
    stroke-dasharray: 5, 5;
    stroke-width : 1px;
  }

  .avg text {
    fill: rgb(180,180,180);
  }

  .resize path {
    fill: #eee;
    stroke: #666;
  }

  .chart-chooser span { margin: 0px 5px 0px 5px; padding-bottom: 3px; cursor:pointer;}

  .samplingLoader img {
    height:9px;
  }

  div.tooltip {
    position: absolute;
    text-align: center;
    z-index:20;
    color:white;
    padding: 4px 6px 4px 6px;
    font: 11px arial;
    background: rgb(80,80,80);
    border: 0px;
    border-radius: 4px;
    pointer-events: none;
  }
  #info { margin: 23px auto 0px auto; width:100%;text-align: center;}
  #info ul{margin: 0px; padding: 0px; list-style-type: none; }
  #info li {display:inline; margin: 0px 0px 0px 50px;}
</style>

<template>
  <div id="bodydiv">

    <div id="selectData">
      <div style="width:700px; margin-left:auto; margin-right:auto; margin-top: 100px">
        <div style="margin-left:auto;margin-right:auto;font-size: 28px; color: rgb(110,110,110); margin-bottom:70px; text-align: center;">
          examine your sequence alignment file in seconds
        </div>

        <file-select-button-bar></file-select-button-bar>
        <div style="clear:both"></div>
        <div id="info">
          <ul>
            <li><a href="http://www.nature.com/nmeth/journal/v11/n12/full/nmeth.3174.html">Publication</a></li>
            <li><router-link :to="{name: 'help'}"><a >File Requirements</a> </router-link></li>
            <li><router-link :to="{name: 'license'}"><a>License</a></router-link></li>
            <li><a :href="require('../../../images/browserCompatability.png')">Compatible Browsers</a></li>
          </ul>
        </div>
      </div>

      <div style="margin: 50px auto 0px auto; font-size: 23px; width: 600px; text-align:center; color: rgb(110,110,110)">
        <div>for variant files check out <a href="http://vcf.iobio.io">vcf.iobio</a></div>
      </div>

      <marth-lab-footer></marth-lab-footer>

    </div>
  </div>
</template>

<script>
  import MarthLabFooter from "../partials/MarthLabFooter.vue";
  import FileSelectButtonBar from "../partials/FileSelectButtonBar.vue";

  export default {
    name: 'home',
    components: {
      FileSelectButtonBar,
      MarthLabFooter
    },
    props: {},
    data() {
      return {
        launchedFromClin: null,
        clinIobioUrls: ["http://localhost:4030", "http://clin.iobio.io"],
        clinIobioUrl: null
      }
    },
    mounted: function() {
      let self = this;
      window.addEventListener("message", self.receiveClinMessage, false);
    },
    methods: {
      receiveClinMessage: function(event) {
        let self = this;
        // Do we trust the sender of this message?
        if (this.clinIobioUrls.indexOf(event.origin) == -1) {
          return;
        }
        this.clinIobioUrl = event.origin;

        var clinObject = JSON.parse(event.data);

        if (clinObject.type == 'set-data') {
          self.launchedFromClin = true;
          self.$router.push({name: 'bam-view', query: { bam: clinObject.modelInfo.bam, bai: clinObject.modelInfo.bai}});

        }

        var responseObject = {success: true, type: 'message-received', sender: 'gene.iobio.io'};
        window.parent.postMessage(JSON.stringify(responseObject), this.clinIobioUrl);
      }

    }
  }
</script>
