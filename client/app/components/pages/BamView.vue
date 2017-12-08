<template>
  <div >
    <app-header></app-header>
    <div>
      {{ selectedFileURL }}
    </div>
    <bar-chart
      :height='metricHeight'
      :width='metricWidth'
      :margin='[0, 8, 20, 8]'
      :data='coverageHistBarData'
    ></bar-chart>
  </div>
</template>

<style>

</style>

<script>

  import AppHeader from "../partials/AppHeader.vue";
  import BarChart from "../viz/BarChart.vue";

  export default {
    name: 'bamview',
    components: {
      BarChart,
      AppHeader
    },
    props: ['selectedFileURL'],
    data() {
      return {
      }
    },
    methods: {

    }
  }
</script>
