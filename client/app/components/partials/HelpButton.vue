<style type="text/css">

  .glyphicon.glyphicon-info-sign {
    cursor: pointer;
    color: #828282;
  }

</style>

<template>
  <span >
    <title class="glyphicon glyphicon-info-sign" aria-hidden="true" id="help_button" title="" style="font-size:0.45em;vertical-align: middle" @click="showModal=true;"></title>

    <help-modal v-if='showModal' @close='showModal = false' :body="body" :modalTitle="modalTitle" parent="this.parent"></help-modal>

  </span>
</template>

<script>
import HelpModal from "./HelpModal.vue";

export default {
  components: {
    HelpModal
  },
  name: 'help-button',
  props: {
    modalTitle: '',
    body: ''
  },
  data() {
    return {
      showModal: false
    }
  },
  methods: {

  }
}


</script>
