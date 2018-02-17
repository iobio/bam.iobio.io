<style type="text/css" scoped>

  .modal {
    transition: all .3s ease;
  }

  .modal-header {
    text-align: left;
    padding: 5px;
    border-bottom: 0;
  }

  .modal-footer {
    padding: 5px;
  }

  .modal-body {
    text-align: justify;
    padding: 10px;
    overflow: auto;
    font-size: 11pt;
    max-height: 500px;
  }

  .modal-mask {
    position: absolute;
    z-index: 9998;
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
    width: 150px;
    transition: all .3s ease;
  }

  button.close {
    -webkit-appearance: none;
    padding: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
  }

  button.btn {
    padding: 5px
  }
  form label {
    width: 60px;
  }
  input {
    width: 75%;
  }

</style>

<template>
    <transition name="modal">
      <div class="modal" style="display: block" @click="$emit('close')">
        <div class="modal-mask">
          <div class="modal-wrapper" @click.stop>
            <div class="modal-dialog">
              <div class="modal-content" >

                <div class="modal-header">
                  <slot name="header">
                    <button type="button" class="close" @click="$emit('close')">&times;</button>
                  </slot>
                </div>

                <div class="modal-body">
                  <slot name="body">
                    <h5 style="margin-top: 0">Specify number of standard deviations from the median to zoom:</h5>
                    <form>
                      <select v-model="sdsFromTheMedian" type="number" @change="save">
                        <option :value="1">1</option>
                        <option :value="2">2</option>
                        <option :value="3">3</option>
                        <option :value="4">4</option>
                        <option :value="5">5</option>
                        <option :value="6">6</option>
                        <option :value="7">7</option>
                        <option :value="8">8</option>
                        <option :value="9">9</option>
                        <option :value="10">10</option>
                      </select>
                    </form>
                  </slot>
                </div>

                <div class="modal-footer">
                  <slot name="footer">
                    <button class="btn btn-default" @click.prevent="reset">
                      Reset
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
  name: 'define-zoom-level-modal',
  props: {
    sdsFromTheMedianOrig: {
      default: 3,
      type: Number
    }
  },
  data() {
    return {
      sdsFromTheMedian: {
        default: 3,
        type: Number
      }
    }
  },
  methods: {
    reset: function() {
      this.sdsFromTheMedian = 3;
      this.save();
    },
    save: function() {
      this.$emit('updateZoom',this.sdsFromTheMedian);
    }
  },
  created: function () {
    this.sdsFromTheMedian = this.sdsFromTheMedianOrig;
  },
}


</script>
