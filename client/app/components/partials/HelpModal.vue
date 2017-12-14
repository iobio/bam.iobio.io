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

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }
  .modal-wrapper {
     vertical-align: top;
   }

  .modal-content {
    width: 700px;
    transition: all .3s ease;
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
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog">
              <div class="modal-content" >

                <div class="modal-header">
                  <slot name="header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">{{modalTitle}}</h4>
                  </slot>
                </div>

                <div class="modal-body">
                  <slot name="body">
                    {{body}}
                  </slot>
                </div>

                <div class="modal-footer">
                  <slot name="footer">
                    <button class="btn btn-default" @click.prevent="$emit('close')">
                      Close
                    </button>
                  </slot>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

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
