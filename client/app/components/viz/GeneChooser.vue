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


export default {
  components: {},
  name: 'gene-chooser',
  props: {
    width: {
      type: Number,
      default: undefined
    },
  },
  data() {
    return {
      window.pieChooserChart = iobio.viz.pieChooser()
      .radius(r)
      .innerRadius(r*.5)
      .padding(pieChooserPadding)
      .transitionDuration(0)
      .color( function(d,i) {
        return color(d.data.name);
      })
      .on("click", function(d,i) {
        setSelectedSeq(d.data.name);
      })
      .on("clickall", function(d,i) {
        window.readDepthChart.trigger('click', 'all');
      })
      .tooltip( function(d) {
        return d.data.name;
      });
    }
  },

  methods: {


  },
  computed: {

  },
  watch: {

  }
}


</script>

