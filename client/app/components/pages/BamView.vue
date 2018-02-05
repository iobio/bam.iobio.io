<style>

  .file-name {
    margin-bottom: -20px;
    padding: 0px 0px 0px 22px;
    font-size: 20px;
    color: rgb(110,110,110);
  }

  .panel {
    margin: 20px;
    padding: 5px;
    border: 1px solid rgb(230,230,230);
    border-radius: 2pt;
    text-align: center;
  }

  .panel#piechooser {
    -webkit-flex: 1 1 250px;
    flex: 1 1 250px;
    -webkit-order: 1;
    order: 1;
    height: 100%;
    position:relative;
    width: 250px;
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
    margin-top: 25px;
    min-height: 600px;
  }

  svg { width: 100%;}

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

  #percents .percent {
    height: 200px;
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

  #distributions .distribution {-webkit-flex: 1 1 100%; flex: 1 1 100%; height:200px; position:relative; /*padding: 0px 15px 0px 15px*/}

  /* Make clicks pass-through */
  #nprogress {
    pointer-events: none;
    -webkit-pointer-events: none;
  }

  #nprogress .bar {
    background: #29d;

    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;

    width: 100%;
    height: 2px;
  }

  /* Fancy blur effect */
  #nprogress .peg {
    display: block;
    position: absolute;
    right: 0px;
    width: 100px;
    height: 100%;
    box-shadow: 0 0 10px #29d, 0 0 5px #29d;
    opacity: 1.0;

    -webkit-transform: rotate(3deg) translate(0px, -4px);
    -moz-transform: rotate(3deg) translate(0px, -4px);
    -ms-transform: rotate(3deg) translate(0px, -4px);
    -o-transform: rotate(3deg) translate(0px, -4px);
    transform: rotate(3deg) translate(0px, -4px);
  }

  /* Remove these to get rid of the spinner */
  #nprogress .spinner {
    display: block;
    position: fixed;
    z-index: 100;
    top: 15px;
    right: 15px;
  }

  #nprogress .spinner-icon {
    width: 14px;
    height: 14px;

    border:  solid 2px transparent;
    border-top-color:  #29d;
    border-left-color: #29d;
    border-radius: 10px;

    -webkit-animation: nprogress-spinner 400ms linear infinite;
    -moz-animation:    nprogress-spinner 400ms linear infinite;
    -ms-animation:     nprogress-spinner 400ms linear infinite;
    -o-animation:      nprogress-spinner 400ms linear infinite;
    animation:         nprogress-spinner 400ms linear infinite;
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

  .iobio-multi-line.line-panel text { fill: black; }
  .iobio-multi-line.button-panel text { fill: white; }
  .iobio-multi-line #iobio-button-all { display: none; }
  .iobio-axis line,.iobio-axis path{fill:none;stroke:#000;shape-rendering:crispEdges}
  .iobio-tooltip{position:fixed;top:0;text-align:center;z-index:20;color:#fff;padding:4px 6px;font:11px arial;background:#505050;border:0;border-radius:4px;pointer-events:none}
  .iobio-brush .extent{stroke:#000;fill-opacity:.125;shape-rendering:crispEdges}
  .iobio-gene .cds,.iobio-gene .utr{fill:#2d8fc1;stroke:#2d8fc1}.iobio-gene .reference{stroke:#969696}
  .iobio-gene .name{font-size:10px;fill:#787878}
  .iobio-gene .arrow{stroke:#969696;fill:none}
  .iobio-gene .iobio-axis line,.iobio-gene .iobio-axis path{fill:none;stroke:#d2d2d2;stroke-width:2px;shape-rendering:crispEdges}
  .iobio-gene .iobio-axis line{stroke-width:4px}
  .iobio-gene .iobio-axis text{font-size:11px;fill:#828282}
  .iobio-multi-line #back-ctrl:hover,.iobio-multi-line .button rect:hover{cursor:pointer}
  .iobio-multi-line .tick text{font-size:10px}.iobio-multi-line .button rect{height:20px}
  .iobio-multi-line .button text{font-size:10px;pointer-events:none}
  .iobio-multi-line #back-ctrl{font-size:15px;fill:#1E7DB3}
  path.link{fill:none;stroke:#ccc;stroke-width:1.5px}
  .above-variant{stroke:red;fill:none}
  .below-variant{stroke:#00f;fill:none}
  .reference{fill:gray}

  .samplingLoader {
    font-size:14px;
    color:#2687BE;
    position:absolute;
    width:100%;
    margin-top: 70px;
    margin-left:-6px;
    display:none;
  }
  .samplingLoader img {
    height:9px;
  }

  .chart-chooser {
    /*                font-size: 16px;*/
    color: rgb(180,180,180);
    font-weight: 400;
    /*                text-align: right;*/
  }

  .chart-chooser .selected {color:#2d8fc1; border-bottom: 1px solid #2d8fc1}
  .chart-chooser span { margin: 0px 5px 0px 5px; padding-bottom: 3px; cursor:pointer;}

  .checkbox {
    cursor:pointer;
    padding-left: 18px;
  }
  .checkbox:checked, .checkbox.checked .icons{
    color: #267FAD;
  }

  @-webkit-keyframes nprogress-spinner {
    0%   { -webkit-transform: rotate(0deg);   transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
  }
  @-moz-keyframes nprogress-spinner {
    0%   { -moz-transform: rotate(0deg);   transform: rotate(0deg); }
    100% { -moz-transform: rotate(360deg); transform: rotate(360deg); }
  }
  @-o-keyframes nprogress-spinner {
    0%   { -o-transform: rotate(0deg);   transform: rotate(0deg); }
    100% { -o-transform: rotate(360deg); transform: rotate(360deg); }
  }
  @-ms-keyframes nprogress-spinner {
    0%   { -ms-transform: rotate(0deg);   transform: rotate(0deg); }
    100% { -ms-transform: rotate(360deg); transform: rotate(360deg); }
  }
  @keyframes nprogress-spinner {
    0%   { transform: rotate(0deg);   transform: rotate(0deg); }
    100% { transform: rotate(360deg); transform: rotate(360deg); }
  }

</style>

<template>
  <div >
    <app-header></app-header>

    <div class="file-name" >
      {{selectedBamURL}}
      <div v-show="selectedBamFile.size>0">
        {{selectedBamFile.name}}
      </div>
    </div>

    <section id="top">

      <div id="piechooser" class="panel">
        <pie-chooser @setSelectedSeq="setSelectedSeq"
                     :selected-item="selectedSeqId"
                     :data="readDepthData"></pie-chooser>
        <select @change="seqSelected" id="reference-select">
          <option value="all">all</option>
        </select>
      </div>

      <read-coverage-box @removeBedFile="removeBedFile"
                         @processBedFile="openBedFile"
                         @addDefaultBedFile="addDefaultBedFile"
                         @setSelectedSeq="setSelectedSeq"
                         :selectedSeqId="selectedSeqId"
                         :draw="draw"
                         :readDepthData="readDepthData"></read-coverage-box>

      <reads-sampled-box @sampleMore="sampleMore" :totalReads="totalReads"></reads-sampled-box>

    </section>

    <section id="middle">
      <div id="percents">

        <percent-chart-box id="mapped_reads"
                           title="Mapped Reads"
                           modal-title="Mapped reads"
                           :modal-body="mappedReadsHelpBody"
                           help-tooltip="Expect a value >90%"
                           :chart-data="mappedReadsData"
                           index-footnote="* full data available in index"></percent-chart-box>

        <percent-chart-box id="forward_strands"
                           title="Forward Strand"
                           modal-title="Forward strand"
                           :modal-body="forwardStrandsHelpBody"
                           help-tooltip="Expect a value ~50%"
                           :chart-data="forwardStrandsData"></percent-chart-box>

        <percent-chart-box id="proper_pairs"
                           title="Proper Pairs"
                           modal-title="Proper pairs"
                           :modal-body="properPairsHelpBody"
                           help-tooltip="Expect a value >90%"
                           :chart-data="properPairsData"></percent-chart-box>

        <percent-chart-box id="singletons"
                           title="Singletons"
                           modal-title="Singletons"
                           :modal-body="singletonsHelpBody"
                           help-tooltip="Expect a value <1%"
                           :chart-data="singletonsData"></percent-chart-box>

        <percent-chart-box id="both_mates_mapped"
                           title="Both Mates Mapped"
                           modal-title="Both mates mapped"
                           :modal-body="bothMatesHelpBody"
                           help-tooltip="Expect a value >90%"
                           :chart-data="bothMatesData"></percent-chart-box>

        <percent-chart-box id="duplicates"
                           title="Duplicates"
                           modal-title="Duplicates"
                           :modal-body="duplicatesHelpBody"
                           help-tooltip="Value depends on depth"
                           :chart-data="duplicatesData"></percent-chart-box>
      </div>

      <div id="distributions" >

        <div id="read-coverage-distribution" class="distribution panel">
          Read Coverage Distribution
          <help-button modalTitle="Read Coverage Distribution" tooltipText="Expect a Poisson distribution centered on the expected mean coverage"
                       :body="readCoverageHelpBody">
          </help-button>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <stacked-histogram :data="readCoverageData" :y-tick-formatter="function(d) { return d*100 + '%'}"></stacked-histogram>
        </div>

        <div id="length-distribution" class="distribution panel">
          <div>
            <help-button modalTitle="Fragment length distribution" tooltipText="Expect a normal distribution"
                            :body="fragmentLengthHelpBody">
            </help-button>
            <span class="chart-chooser">
              <span class="selected" @click="toggleChart('lengthData')" :datafield="lengthData" data-outlier="false" data-id="frag_hist">Fragment Length</span> |
              <span @click="toggleChart('lengthData')" :datafield="lengthData" data-id="length_hist" data-outlier="true">Read Length</span>
            </span>
            <help-button modalTitle="Read length distribution" tooltipText="Expect an extremely narrow distribution"
                         :body="readLengthHelpBody">
            </help-button>
          </div>
          <label class="checkbox" style="position:absolute;right:10px;top:24px;" >
            <input type="checkbox" v-model="readOutliers" class="outlier" >
            Outliers
          </label>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
            <stacked-histogram :data="lengthData" ></stacked-histogram>
          </div>

        <div id="mapping-quality-distribution" class="distribution panel">
          <div>
            <help-button modalTitle="Mapping quality distribution" tooltipText="Expect distribution weighted to high values (~60)"
                         :body="mappingQualityHelpBody">
            </help-button>
            <span class="chart-chooser">
              <span @click="toggleChart('qualityData')" data-id="mapq_hist" class="selected">Mapping Quality</span> |
              <span data-id="baseq_hist" @click="toggleChart('qualityData')">Base Quality</span>
            </span>
            <help-button modalTitle="Base quality distribution" tooltipText="Expect most values >40"
                         :body="baseQualityHelpBody">
            </help-button>
          </div>
          <div class="samplingLoader">Sampling <img src="../../../images/loading_dots.gif"/></div>
          <stacked-histogram :data="qualityData" ></stacked-histogram>
        </div>
      </div>
    </section>

  </div>
</template>

<script>

  import AppHeader from "../partials/AppHeader.vue";
  import ReadsSampledBox from "../partials/ReadsSampledBox.vue";
  import HelpButton from "../partials/HelpButton.vue";
  import ReadCoverageBox from "../partials/ReadCoverageBox.vue";

  import PieChooser from "../viz/PieChooser.vue";

  import DefaultBed from '../../../../data/20130108.exome.targets.bed';
  import DonutChart from "../viz/DonutChart.vue";
  import PercentChartBox from "../partials/PercentChartBox.vue";
  import StackedHistogram from "../viz/StackedHistogram.vue";


  export default {
    name: 'bamview',

    components: {
      StackedHistogram,
      PercentChartBox,
      DonutChart,
      PieChooser,
      ReadCoverageBox,
      HelpButton,
      ReadsSampledBox,
      AppHeader
    },

    props: {
      selectedBamURL: '',
      selectedBaiURL: '',
      selectedBamFile: {
        default: function() {
          return new File([""], "emptyfile");
        },
        type: File
      },
      selectedBaiFile: {
        default: function() {
          return new File([""], "emptyfile");
        },
        type: File
      },
      regionURLParam: '',
      sampling: '',

      // parameters for when triggered from Illumina
      action: '',
      appSessionHref: '',
      authorization_code: ''
    },

    data() {
      return {

        // default sampling values
        samplingBinSize: 40000,
        binNumber: 20,
        binSize: 40000,
        sampleMultiplier: 1,
        sampleMultiplierLimit: 4,
        totalReads: 0,

        exomeSampling: false,
        draw: false,

        sampleStats: {},

//        bam: {},
        bed: {},

        readDepthData: [],
        selectedSeqId: 'all',
        region: {},

        // Percent Chart Data
        mappedReadsData: [],
        forwardStrandsData: [],
        properPairsData: [],
        singletonsData: [],
        bothMatesData: [],
        duplicatesData: [],

        // Histogram Chart Data
        readOutliers: false,
        readCoverageData: [],
        lengthData: [],
        qualityData: [],

        // Help Modal Bodies
        mappedReadsHelpBody:
        "<div>\n" +
        "  The mapped reads chart shows how many of the reads in the sample were successfully mapped to the reference genome. Genetic variation, in particular structural variants, ensure that every sequenced sample is genetically different to the reference genome it was aligned to. If the sample differs only in a small number of single base pair changes (e.g. SNVs), the read will still likely map to the reference, but, for more significant variation, the read can fail to be placed. Therefore, it is not expected that the mapped reads rate will hit 100%, but it is expected to be high (usually >90%).\n" +
        "</div>\n" +
        "<div class=\"row vertical-align\">\n" +
        "  <div class=\"col-xs-4\">\n" +
        "    <img title=\"Acceptable mapped reads rate\" style=\"width:100%;\"  src=\"../../../images/mapped_reads_high.png\"></img>\n" +
        "  </div>\n" +
        "  <div class=\"col-xs-8\">\n" +
        "    This is an example of a human, whole exome. In this case, 99.7% of the sampled reads map to the reference, corresponding to 93,385 actual reads. It is important to note that when the wheel is blue, only reads that have been assigned to a reference sequence are included. This means that the 0.3% of reads that are unmapped have a mate pair that successfully maps to the reference genome.\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "<div class=\"row vertical-align\">\n" +
        "    <div class=\"col-xs-4\">\n" +
        "      <img title=\"Acceptable mapped reads rate\" style=\"width:100%;\" src=\"../../../images/mapped_reads_high_green.png\"></img>\n" +
        "    </div>\n" +
        "    <div class=\"col-xs-8\">\n" +
        "      For the case that both mates from paired end sequencing are unmapped, they appear at the end of the BAM file. Usually, the number of such unmapped reads can be obtained from the index file. When this is possible, the wheel will appear in green, as shown for this whole genome sample.\n" +
        "    </div>\n" +
        "</div>\n" +
        "\n" +
        "<div class=\"row vertical-align\">\n" +
        "    <div class=\"col-xs-4\">\n" +
        "      <img title=\"Acceptable mapped reads rate\" style=\"width:100%;\" src=\"../../../images/mapped_reads_low.png\"></img>\n" +
        "    </div>\n" +
        "    <div class=\"col-xs-8\">\n" +
        "      If the rate of mapped reads is low (usually below 90%), questions need to be asked about the sample to understand why so many reads are unmapped. The last example only has 71.5% of reads mapping to the reference genome for a whole genome sample. This was caused as the sample was contaminated with a significant amount of bacterial DNA; the DNA sample was obtained from a saliva sample, rather than a blood draw.\n" +
        "    </div>\n" +
        "</div>",

        forwardStrandsHelpBody: "The forward strand chart shows the fraction of reads that map to the forward DNA strand. The general expectation is that the DNA library preparation step will generate DNA from the forward and reverse strands in equal amounts. After mapping the reads to the reference genome, approximately 50% of the reads will consequently map to the forward strand. If the observed rate is significantly different to 50%, this may be indicative of problems with the library preparation step.",

        properPairsHelpBody:
        "<div>\n" +
        "  A fragment consisting of two <i>mates</i> is called a proper pair if both <i>mates</i> map to the reference genome in a manner consistent with expectations. In particular, if the DNA library consists of fragments ~500 base pairs in length, and 100 base pair reads are sequenced from either end, the expectation would be that the two reads map to the reference genome separated by ~300 base pairs. If the sequenced sample contains large structural variants, e.g. a large insertion, reads mapping with a large separation would be a signal for this variant, and the reads would not be proper pairs. Based on the sequencing technology, there is also an expectation on the orientation of each read in the fragment.\n" +
        "</div>\n" +
        "<br>\n" +
        "<div>\n" +
        "  <i><strong>When calculating the proper pair rate, pairs where both mates are unmapped are not included in the analysis.</strong></i> As a consequence, the rate of proper pairs is expected to be well over 90%; even if the mapping rate itself is low as a result of bacterial contamination, for example.\n" +
        "</div>",

        singletonsHelpBody: "When working with paired-end sequencing, each DNA fragment is sequenced from both ends, creating two <i>mates</i> for each pair. If one <i>mate</i> in the pair successfully maps to the reference genome, but the other is unmapped, the mapped mate is a <i>singleton</i>. One way in which a singleton could occur would be if the sample has a large insertion compared with the reference genome; one <i>mate</i> can fall in sequence flanking the insertion and will be mapped, but the other falls in the inserted sequence and so cannot map to the reference genome. There are unlikely to many such structural variants in the sample, or sequencing errors that would could cause a read to not be able to map. Consequently, the singleton rate is expected to be very low (<1%).",

        bothMatesHelpBody: "When working with paired-end sequencing, each DNA fragment is sequenced from both ends, creating two <i>mates</i> for each pair. This chart shows the fraction of reads in pairs where both of the <i>mates</i> successfully map to the reference genome. <i><strong>When calculating this metric, pairs where both mates are unmapped are not included.</strong></i>.",

        duplicatesHelpBody:
        "<div>\n" +
        "  PCR duplicates are two (or more) reads that originate from the same DNA fragment. When sequencing data is analysed, it is assumed that each observation (i.e. each read) is independent; an assumption that fails in the presence of duplicate reads. Typically, algorithms look for reads that map to the same genomic coordinate, and whose mates also map to identical genomic coordinates. It is important to note that as the sequencing depth increases, more reads are sampled from the DNA library, and consequently it is increasingly likely that duplicate reads will be sampled. As a result, the true duplicate rate is not independent of the depth, and they should both be considered when looking at the duplicate rate. Additionally, as the sequencing depth in increases, it is also increasingly likely that reads will map to the same location and be marked as duplicates, even when they are not. As such, as the sequencing depth approaches and surpasses the read length, the duplicate rate starts to become less indicative of problems.\n" +
        "</div>\n" +
        "<div class=\"row vertical-align\">\n" +
        "  <div class=\"col-xs-4\">\n" +
        "    <img title=\"Acceptable duplicate rate\" style=\"width:100%; padding-bottom:15px;\"  src=\"../../../images/dup_good.png\"></img>\n" +
        "  </div>\n" +
        "  <div class=\"col-xs-8\">\n" +
        "    This is an example of the duplicate rate for a ~80X human whole genome. The expectation is that the duplicate rate is low (well below 10%), and consequently, this sample would be considered good.\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "<div class=\"row vertical-align\">\n" +
        "  <div class=\"col-xs-4\">\n" +
        "    <img title=\"Acceptable duplicate rate\" style=\"width:100%;padding-bottom:15px;\"  src=\"../../../images/dup_good_low_cov.png\"></img>\n" +
        "  </div>\n" +
        "  <div class=\"col-xs-8\">\n" +
        "    If the median coverage drops to ~50X, the duplicate rate should be even lower.\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "<div class=\"row vertical-align\">\n" +
        "  <div class=\"col-xs-4\">\n" +
        "\t\t\t          <img title=\"Potentially problematic duplicate rate\" style=\"width:100%;\"  src=\"../../../images/dup_bad.png\"></img>\n" +
        "  </div>\n" +
        "  <div class=\"col-xs-8\">\n" +
        "    This is a different sample with ~50X coverage, but now the duplicate rate is much higher. This sample could well have problems at the library prep stage and should potentially be resequenced.\n" +
        "  </div>\n" +
        "</div>",

        readCoverageHelpBody:
        "<div>\n" +
        "  This chart shows how read coverage is distributed, and the expected distribution is dependent on the type of sequencing data being visualized.\n" +
        "</div>\n" +
        "<br>\n" +
        "<div><strong><i>Whole genome sequencing</i></strong></div>\n" +
        "<div>\n" +
        "  In a whole genome sequencing experiment, the expectation is that the read coverage follows a Poisson distribution centred about the requested sequencing depth. The following example shows a high quality read coverage distribution for a sample sequenced to ~50X coverage. The distribution shows a nice Poisson distribution, and is centred around ~53X. (Note that the second scale at the bottom of the chart can be used to zoom in on desired parts of the distribution).\n" +
        "  <img title=\"A good read coverage distribution\" style=\"width:100%; padding-top:15px; padding-bottom:20px;\"  src=\"../../../images/read_coverage_dist_zoomed.png\"></img>\n" +
        "    Alternatively, if the distribution shows multiple peaks, isn't Poisson distributed, or is not centred around the expected coverage, it may be necessary to consider resequencing the sample, or at least, being aware that problems may arise in analysing the data. While the following distribution shows a median coverage around that expected (~80X), but with a significant portion of the genome at zero coverage and the multiple peaks, this would not be considered a good sample.\n" +
        "  <img title=\"A bad read coverage distribution\" style=\"width:100%; padding-top:15px; padding-bottom:20px;\"  src=\"../../../images/read_coverage_dist_bad.png\"></img>\n" +
        "</div>\n" +
        "<br>\n" +
        "<div><strong><i>Whole exome sequencing</i></strong></div>\n" +
        "<div>\n" +
        "  Exome sequencing relies on the targetted capture of DNA from the exome, followed by DNA amplification. This leads to large variation in the sequencing depth across exons, and consequently, the read coverage distribution is no longer expected to be Poisson distributed. When sampling across the entire genome, the majority of genomic regions will contain no sequencing reads as will are not exonic regions. This leads to a read coverage distribution overwhelmingly weighted to zero coverage as shown below.\n" +
        "  <img title=\"Exome sequencing\" style=\"width:100%; padding-top:15px; padding-bottom:20px;\"  src=\"../../../images/read_coverage_dist_exome.png\"></img>\n" +
        "  To restrict sampling to exonic regions, select the default bed file in the top 'Read Coverage' chart. It is also possible to select a custom bed file, if available. After selecting the default bed, the distribution above is updated to as shown below.\n" +
        "  <img title=\"Exome sequencing using default bed\" style=\"width:100%; padding-top:15px; padding-bottom:20px;\"  src=\"../../../images/read_coverage_dist_exome_bed.png\"></img>\n" +
        "  This does not have a Poisson distribution and shows the wide distribution of coverage in the exonic regions. The sequenced depth appears to be centred around ~50X, so if this is consistent with the requested depth, this sample would be considered good.\n" +
        "</div>",

        fragmentLengthHelpBody:
        "<div>\n" +
        "  For paired end sequencing, DNA fragments are typically size selected to a uniform length and then sequenced from either end. Once the two mates are aligned back to the reference genome, the fragment length can be inferred from how far apart these two mates map. If the sequenced sample has a deletion or insertion relative to the reference, this will result in the two mates mapping closer together, or further apart than expected. Under the assumption that the sequenced sample has a relatively small number of insertions and deletions, we expect to see the fragment length follow a normal distribution.\n" +
        "</div>\n" +
        "<br>\n" +
        "<div><strong><i>Whole genome sequencing</i></strong></div>\n" +
        "<div>\n" +
        "  This is an example of the fragment length distribution for a high coverage (~80X) whole genome. The read lengths in this sample are 150bp, so a fragment can not be shorter than this value, consequently, we see a sharp cutoff at a fragment length of 150bp.\n" +
        "</div>\n" +
        "<div>\n" +
        "  <img title=\"WGS sequencing\" style=\"width:100%; padding-top:15px; padding-bottom:20px;\"  src=\"../../../images/fragment_wgs.png\"></img>\n" +
        "</div>\n" +
        "<br>\n" +
        "<div><strong><i>Whole exome sequencing</i></strong></div>\n" +
        "<div>\n" +
        "  Similarly, this is the fragment length distribution for a high coverage exome.\n" +
        "</div>\n" +
        "<div>\n" +
        "  <img title=\"Exome sequencing\" style=\"width:100%; padding-top:15px; padding-bottom:20px;\"  src=\"../../../images/fragment_exome.png\"></img>\n" +
        "</div>",

        readLengthHelpBody: "The mapping quality distribution shows the Phred quality scores describing the probability that a read <i>does not</i> map to the location that it has been assigned to (specifically, Q=-log<sub>10</sub>(P), where Q is the Phred score and P is the probability the read is in the wrong location). So the larger the score, the higher the quality of the mapping. Some scores have specific meaning, e.g. a score of 0 means that the read could map equally to multiple places in the reference genome. The majority of reads should be well mapped and so we expect to see this distribution heavily skewed to large value (typically around 60). It is not unusual to see some scores around zero. Reads originating from repetitive elements in the genome will plausibly map to multiple locations.",

        mappingQualityHelpBody: "The mapping quality distribution shows the Phred quality scores describing the probability that a read <i>does not</i> map to the location that it has been assigned to (specifically, Q=-log<sub>10</sub>(P), where Q is the Phred score and P is the probability the read is in the wrong location). So the larger the score, the higher the quality of the mapping. Some scores have specific meaning, e.g. a score of 0 means that the read could map equally to multiple places in the reference genome. The majority of reads should be well mapped and so we expect to see this distribution heavily skewed to large value (typically around 60). It is not unusual to see some scores around zero. Reads originating from repetitive elements in the genome will plausibly map to multiple locations.",

        baseQualityHelpBody: "Similar to the mapping quality distribution, the base quality distribution shows the Phred quality scores describing the probability that a nucleotide has been <i>incorrectly</i> assigned; e.g. an error in the sequencing. Specifically, Q=-log<sub>10</sub>(P), where Q is the Phred score and P is the probability the nucleotide is wrong. The larger the score, the more confident we are in the base call. Depending on the sequencing technology, we can expect to see different distributions, but we expect to see a distribution skewed towards larger (more confident) scores; typically around 40.",


      }
    },

    methods: {

      goSampling: function (options) {
        // add default options
        options = $.extend({
          exomeSampling: this.exomeSampling, //'checked' == $("#depth-distribution input").attr("checked"),
          bed: this.bed,
          onEnd: function () {
            NProgress.done();
          }
        }, options);

        // turn on sampling message and off svg
        $("section#middle svg").css("display", "none");
        $(".samplingLoader").css("display", "block");

        this.totalReads = 0;

        NProgress.start();
        NProgress.set(0);

        // update selected stats
        window.bam.sampleStats(function (data) {
          // turn off sampling message
          $(".samplingLoader").css("display", "none");
          $("section#middle svg").css("display", "block");
          this.sampleStats = data;

          // update progress bar
          if (options.start != null && options.end != null) {
            var length = options.end - options.start;
            var percentDone = Math.max(Math.round(((this.sampleStats.last_read_position - options.start) / length) * 100) / 100, 0);
          } else {
            var length = window.bam.header.sq.reduce(function (prev, curr) {
              if (prev) return prev;
              if (curr.name == options.sequenceNames[0]) return curr;
            }, false).end;
            var percentDone = Math.round((this.sampleStats.last_read_position / length) * 100) / 100;
          }

          if (NProgress.status < percentDone) NProgress.set(percentDone);

          // update charts
          this.updatePercentCharts();
          this.totalReads = this.sampleStats.total_reads;
          this.updateHistogramCharts(undefined, "sampleBar");

        }.bind(this), options);
      },

      updatePercentCharts: function () {

        var unmappedReads, mappedReads;
        var stats = this.sampleStats;

        if (this.selectedSeqId == 'all') {
          if (window.bam.readDepth[Object.keys(window.bam.readDepth)[0]].mapped != undefined) {
            mappedReads = unmappedReads = 0;
            for (var id  in window.bam.readDepth) {
              mappedReads += window.bam.readDepth[id].mapped;
              unmappedReads += window.bam.readDepth[id].unmapped;
            }
            unmappedReads = window.bam.n_no_coor;
          }
        } else {
          mappedReads = window.bam.readDepth[this.selectedSeqId].mapped;
          unmappedReads = window.bam.readDepth[this.selectedSeqId].unmapped;
        }

        var showMappedDataFromIndex = false;
        // TODO: Deal with brush
        var brushRange = undefined;// window.readDepthChart.brush().extent();
        if ((brushRange == undefined || brushRange.toString() == '0,0') && mappedReads != undefined && unmappedReads != undefined) {
          showMappedDataFromIndex = true;
          d3.select("#mapped_reads_chart").selectAll('path')
            .attr('fill', function (d, i) {
              return i == 0 ? 'rgb(9,176,135)' : 'rgba(9,176,135,0.5)'
            });
          d3.select('.percent .from-index').style('visibility', 'visible');
        } else {
          d3.select('.percent .from-index').style('visibility', 'hidden');
        }

        //update percent charts
        var keys = ['mapped_reads', "proper_pairs", "forward_strands", "singletons", "both_mates_mapped", "duplicates"]

        keys.forEach(function (key, i) {
          var stat = stats[key];
          if (key == 'mapped_reads' && showMappedDataFromIndex) {
            var data = [mappedReads, unmappedReads];
          } else {
            if (stats['total_reads'] == 0)
              var data = [0, 100];
            else
              var data = [stat, stats['total_reads'] - stat];
          }
          if (key == 'mapped_reads') {
            this.mappedReadsData = data;
          } else if (key == 'forward_strands') {
            this.forwardStrandsData = data;
          } else if (key == 'proper_pairs') {
            this.properPairsData = data;
          } else if (key == 'singletons') {
            this.singletonsData = data;
          } else if (key == 'both_mates_mapped') {
            this.bothMatesData = data;
          } else if (key == 'duplicates') {
            this.duplicatesData = data;
          }

        }.bind(this));
      },

      updateHistogramCharts: function (otherMinMax, klass) {
        var histograms = this.sampleStats;

        // check if coverage is zero
        if (Object.keys(histograms.coverage_hist).length == 0) histograms.coverage_hist[0] = '1.0';

        // update read coverage histogram
        var d = Object.keys(histograms.coverage_hist).filter(function (i) {
          return histograms.coverage_hist[i] != "0"
        }).map(function (k) {
          return [+k, +histograms.coverage_hist[k]]
        });
        this.readCoverageData = d;

        // update length histograms
        this.updateLengthHistograms();

        // update map quality distribution
        if ($("#mapping-quality-distribution .selected").attr("data-id") == "mapq_hist")
          var d = Object.keys(histograms.mapq_hist).map(function (k) {
            return [+k, +histograms.mapq_hist[k]]
          });
        else
          var d = Object.keys(histograms.baseq_hist).map(function (k) {
            return [+k, +histograms.baseq_hist[k]]
          });
        this.qualityData = d;
      },

      toggleChart: function (chartData) {
        var elem = event.target;

        if ($(elem).hasClass("selected")) return;

        // toggle selected
        var pair = [elem, $(elem).siblings()[0]];
        $(pair).toggleClass('selected');

        // redraw chart
        var dataId = elem.getAttribute("data-id")

        var h = this.sampleStats[dataId];
        var d = Object.keys(h).map(function (k) {
          return [+k, +h[k]]
        });
        var chartDiv = $(elem).parent().parent().parent();

        if (chartDiv.find(".selected").attr("data-id") == "frag_hist") {
          if (!this.readOutliers) d = iobio.viz.layout.outlier()(d);
        }

        this[chartData] = d;
      },

      updateLengthHistograms: function () {

        var histograms = this.sampleStats;

        if ($("#length-distribution .selected").attr("data-id") == "frag_hist")
          var d = Object.keys(histograms.frag_hist).filter(function (i) {
            return histograms.frag_hist[i] != "0"
          }).map(function (k) {
            return [+k, +histograms.frag_hist[k]]
          });
        else
          var d = Object.keys(histograms.length_hist).map(function (k) {
            return [+k, +histograms.length_hist[k]]
          });

        // remove outliers if outliers checkbox isn't explicity checked
        if (!this.readOutliers) d = iobio.viz.layout.outlier()(d);
        this.lengthData = d;

      },

      sampleMore: function () {
        if (this.sampleMultiplier >= this.sampleMultiplierLimit) {
          alert("You've reached the sampling limit");
          return;
        }
        this.sampleMultiplier += 1;
        var options = {
          sampling: this.sampling,
          sequenceNames: this.getSelectedSeqIds(),
          binNumber: this.binNumber + parseInt(this.binNumber / 4 * this.sampleMultiplier),
          binSize: this.binSize + parseInt(this.binSize / 4 * this.sampleMultiplier)
        }
        // if (window.readDepthChart.brush().extent().length != 0 && window.readDepthChart.brush().extent().toString() != "0,0") {
        //   options.start = parseInt(this.depthChart.brush().extent()[0]);
        //   options.end = parseInt(this.depthChart.brush().extent()[1]);
        // }
        this.goSampling(options);
      },

      getSelectedSeqIds: function () {
        if (this.selectedSeqId == 'all') {
          return Object.keys(window.bam.readDepth)
            .filter(function (key) {
              if (key.substr(0, 4) == 'GL00' || key.substr(0, 6).toLowerCase() == "hs37d5")
                return false
              if (window.bam.readDepth[key].length > 0)
                return true
            })
        } else
          return [this.selectedSeqId];
      },

      seqSelected: function (event) {
        this.setSelectedSeq(event.target.value);
      },

      setSelectedSeq: function (selected, start, end) {
        this.selectedSeqId = selected;
        if (selected == 'all') {
          var seqDataIds = Object.keys(window.bam.readDepth)
            .filter(function (key) {
              if (key.substr(0, 4) == 'GL00' || key.substr(0, 6).toLowerCase() == "hs37d5")
                return false
              if (window.bam.readDepth[key].length > 0)
                return true
            })
        } else {
          var seqDataIds = [selected];
        }

        $("#reference-select").val(selected);

        // reset brush
        this.resetBrush();
        this.setUrlRegion({chr: selected, 'start': start, 'end': end});

        // start sampling
        if (start != undefined && end != undefined) {
          this.goSampling({sampling: this.sampling, sequenceNames: seqDataIds, 'start': start, 'end': end});
          setTimeout(function () {
            this.setBrush(start, end)
          }.bind(this), 200);
        } else {
          this.goSampling({sampling: this.sampling, sequenceNames: seqDataIds});
        }
      },

      setUrlRegion: function (region) {
        this.region = region;

        if (window.bam.sourceType == 'url' && region != undefined) {
          if (region.start != undefined && region.end != undefined) {
            var regionStr = region.chr + ':' + region.start + '-' + region.end;
          } else {
            var regionStr = region.chr;
          }

          this.$router.replace({ name: "bam-view", query: { bamURL: this.selectedBamURL, baiURL: this.selectedBaiURL, region: regionStr, sampling: this.sampling}});
        }
      },

      removeBedFile: function () {
        $("#remove-bedfile-button").css('visibility', 'hidden');
        $("#default-bedfile-button").css('visibility', 'visible');
        $("#add-bedfile-button").css('visibility', 'visible');
        this.bed = undefined;
        this.goSampling({sampling: this.sampling, sequenceNames: this.getSelectedSeqIds()});
      },

      addDefaultBedFile: function () {
        // clear brush on read coverage chart
        this.resetBrush();

        // hide add bed / show remove bed buttons
        $("#add-bedfile-button").css('visibility', 'hidden');
        $("#default-bedfile-button").css('visibility', 'hidden');
        $("#remove-bedfile-button").css('visibility', 'visible');

        // turn on sampling message and off svg
        // turn it on here b\c the bed file is so big it takes a while to download
        $("section#middle svg").css("display", "none");
        $(".samplingLoader").css("display", "block");

        var defaultBed = DefaultBed.replace(/chr/g, '');
        this.bed = defaultBed;
        this.goSampling({sampling: this.sampling, sequenceNames: this.getSelectedSeqIds()});
      },

      openBedFile: function (file) {
        // clear brush on read coverage chart
        this.resetBrush();

        // hide add bed / show remove bed buttons
        $("#add-bedfile-button").css('visibility', 'hidden');
        $("#default-bedfile-button").css('visibility', 'hidden');
        $("#remove-bedfile-button").css('visibility', 'visible')

        // read bed file and store
        var reader = new FileReader();
        reader.onload = function (theFile) {
          this.bed = this.result;
          this.goSampling({sampling: this.sampling, sequenceNames: this.getSelectedSeqIds()});
        }.bind(this)
        reader.readAsText(file)
      },

      openBamFile: function () {
        window.bam = new Bam(this.selectedBamFile, {bai: this.selectedBaiFile});
        this.goBam(this.region);
      },

      goBam: function (region) {
        $("#selectData").css("display", "none");
        $("#showData").css("visibility", "visible");

        // get read depth
        window.bam.estimateBaiReadDepth(function (id, points, done) {
          // setup first time and sample

          if (Object.keys(window.bam.readDepth).length == 1) {
            // turn on sampling message
            $(".samplingLoader").css("display", "block");

          }

          var allPoints = Object.keys(window.bam.readDepth)
            .filter(function (key) {
              if (key.substr(0, 4) == 'GL00' || key.substr(0, 6).toLowerCase() == "hs37d5")
                return false
              if (window.bam.readDepth[key].length > 0)
                return true
            })
            .map(function (key) {
              return {"name": key, "data": window.bam.readDepth[key]}
            });

          this.readDepthData = allPoints;

          var selection = d3.select('#depth-distribution .chart').datum(allPoints);

          if (allPoints.length > 50) {
            $('#piechooser svg').css('visibility', 'hidden');
            $('.too-many-refs').css('display', 'block');
            this.draw = false;
          }

          $('#reference-select')
            .append($("<option></option>")
              .attr("value", id)
              .text(id));

          var start = region ? region.start : undefined;
          var end = region ? region.end : undefined;

          if (done) {
            // turn off read depth loading msg
            $("#readDepthLoadingMsg").css("display", "none");
            // Draw read depth chart
            this.draw = true;

            // Set selected seq & region
            if (!region || (region && region.chr == 'all'))
              this.setSelectedSeq('all', start, end);
            else
              this.setSelectedSeq(region.chr, start, end);
          }

          var totalPoints = allPoints.reduce(function (acc, val) {
            return acc + val.data.length
          }, 0)
          if (done && totalPoints <= 1) {
            $('#not_enough_data').css('display', 'block');
          }
        }.bind(this));

      },

      getIlluminaAccessToken : function(callback) {
        var basespace = 'nv-dev-new.iobio.io/basespaceauth/';
        var cmd = new iobio.cmd(basespace, [this.authorization_code]);

        cmd.on('data', function(d) {
          var accessToken = JSON.parse(d).access_token
          callback(accessToken);
        })
          .on('error', function(e) { /*console.error(e)*/ ;})
          .run()
      },

      getIlluminaBamBaiUrls : function (callback) {
        var apiUrl = "https://api.basespace.illumina.com/";

        getIlluminaAccessToken(function(accessToken) {
          $.ajax({
            url: apiUrl + this.appSessionHref,
            data: {access_token: accessToken},
            type: 'GET',
            contentType: "application/json",
            dataType: 'json',
            error: function(error) {
              console.error(error);
            }

          }).done(function(sessionRes) {
            var bamHref, baiHref;

            sessionRes.Response.References.forEach(function(ref) {
              if (ref.Type == 'File' && ref.Rel == 'Input') {
                if (ref.Content.Name.slice(-3) == 'bam')
                  bamHref = ref.Content.HrefContent;
                else if (ref.Content.Name.slice(-3) == 'bai')
                  baiHref = ref.Content.HrefContent;
              }
            })

            // get bam S3 location
            $.ajax({
              url: apiUrl + bamHref,
              data: {access_token: accessToken, redirect: 'meta'},
              type: 'GET',
              contentType: "application/json",
              dataType: 'json',
              error: function(error) {
                console.error(error);
              }
            }).done(function(bamRes) {

              var bamUrl = '"' + bamRes.Response.HrefContent + '"' ;

              // get bai s3 location
              $.ajax({
                url: apiUrl + baiHref,
                data: {access_token: accessToken, redirect: 'meta'},
                type: 'GET',
                contentType: "application/json",
                dataType: 'json',
                error: function(error) {
                  console.error(error);
                }
              }).done(function(baiRes) {
                var baiUrl = '"' + baiRes.Response.HrefContent + '"';
                callback(bamUrl, baiUrl);
              })
            })
          })
        })
      },

      setBrush: function (start, end) {
        // var brush = window.readDepthChart.brush();
        // set brush region
        // d3.select("#depth-distribution .iobio-brush").call(brush.extent([start,end]));
      },

      resetBrush: function () {
        this.setBrush(0, 0);
      },

      load: function() {
        this.bed = undefined;
        this.region = undefined;

        if ( this.action == 'trigger' ){

          // If triggered from Illumina
          getIlluminaBamBaiUrls(function(bamUrl, baiUrl) {
            this.bam = new Bam(bamUrl, { bai: baiUrl});
            this.goBam(undefined);
          }.bind(this))

        } else if ( this.selectedBamURL && this.selectedBamURL != '' ) {
          // Props should be set by query params
          window.bam = new Bam(this.selectedBamURL, {bai: this.selectedBaiURL});

          if (this.regionURLParam != undefined && this.regionURLParam != '') {
            if (this.regionURLParam.split(":").length == 1)
              this.region = { chr: this.regionURLParam.split(":")[0]}
            else
              this.region = {
                chr: this.regionURLParam.split(":")[0],
                start: parseInt(this.regionURLParam.split(":")[1].split('-')[0]),
                end: parseInt(this.regionURLParam.split(":")[1].split('-')[1])
              };
          }

          this.goBam(this.region);

        } else if ( this.selectedBamFile.size>0 && this.selectedBaiFile.size>0 ){
          // Local files, so properties set by router params instead of query
          this.openBamFile();
        }
      }

    },

    created: function () {
      this.load();
    },

    watch: {
      readOutliers: function() {
        this.updateLengthHistograms();
      },

    }

  }


</script>
