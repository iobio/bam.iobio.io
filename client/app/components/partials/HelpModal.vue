<style type="text/css">

  .modal-header {
    text-align: left;
  }
  .modal-body {
    text-align: justify;
    padding: 30px;
    overflow: scroll;
    font-size: 12pt;
  }
  button.close {
    -webkit-appearance: none;
    padding: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
  }

</style>

<template>
    <transition name="modal">
      <div class="modal" style="display: block" @click="$emit('close')">
        <div class="modal-dialog">
          <div class="modal-content" >

            <div class="modal-header">
              <slot name="header">
                <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">{{modalTitle}}</h4>
              </div>
              </slot>
            </div>

            <div class="modal-body">
              <slot name="body">
                {{body}}
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                <button class="modal-default-button" @click.prevent="$emit('close')">
                  Close
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!--<div id="helpModalA" class="modal fade" role="dialog" v-show="showModal">-->
      <!--<div class="modal-dialog" style="width:700px;">-->
        <!--<div class="modal-content">-->
          <!--<div class="modal-header">-->
            <!--<button type="button" class="close" data-dismiss="modal">&times;</button>-->
            <!--<h4 class="modal-title">{{modalTitle}}</h4>-->
          <!--</div>-->
          <!--<div class="modal-body" style="overflow:auto;">-->
            <!--<div>-->
              <!--{{body}}-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="modal-footer">-->
            <!--<button type="button" class="btn btn-default" data-dismiss="modal" @click="$emit('close')">Close</button>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->

</template>

<script>
export default {
  name: 'help-modal',
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
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  }
}


</script>
