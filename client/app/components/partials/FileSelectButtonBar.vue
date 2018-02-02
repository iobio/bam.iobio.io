<style type="text/css">
  .file {
    width: 300px;
    text-align:center;
  }
  .file-button{
    border-radius: 4px;
    width: 315px;
    float:right;
    background: #2d8fc1;
    padding: 20px 30px;
    color: #fff;
    font-size:24px;
    cursor: pointer;
    font-weight: 300;
  }
  .file label {
    float:left;
  }
  .file input {
    position: absolute;
    display: inline-block;
    left: 0;
    top: 0;
    opacity: 0.01;
    visibility:hidden;
    cursor: pointer;
  }
  .arrow_box {
    position: relative;
    background: #ffffff;
    border: 2px solid #2d8fc1;
    border-radius: 4px;
  }
  .arrow_box:after, .arrow_box:before {
    bottom: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  .arrow_box:after {
    border-color: rgba(255, 255, 255, 0);
    border-bottom-color: #ffffff;
    border-width: 20px;
    left: 78%;
    margin-left: -20px;
  }
  .arrow_box:before {
    border-color: rgba(45, 143, 193, 0);
    border-bottom-color: #2d8fc1;
    border-width: 23px;
    left: 78%;
    margin-left: -23px;
  }
  .arrow_box input {
    width:610px;
    margin: 8px;
    color: #2d8fc1;
    font:300 30px quicksand;
  }
  .arrow_box button { font:300 28px quicksand;}

</style>

<template>
  <div>
    <div class="file" @click="showUrl=false">
      <input type="file" name="files[]" id="file"  multiple @change="processBamFile" />
      <label class="file-button" for="file" >choose bam file</label>
    </div>
    <div class="file-button" style="text-align:center" @click="displayBamUrlBox()">choose bam url</div>
    <div style="clear:both"></div>
    <div v-if="showUrl" id='bam-url' style="margin-top:18px;width:700px;margin-left:auto;margin-right:auto" class="arrow_box">
      <input id="url-input" value="http://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam" ></input>
      <input id="bai-url-input" placeholder="BAI URL (optional)" ></input>
      <button id="bam-url-go-button" @click="openBamURL">
          Go
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'file-select-button-bar',
  data() {
    return {
      selectedFileURL: '',
      selectedBaiFileURL: '',
      showUrl: false
    }
  },
  methods: {

    displayBamUrlBox : function() {
      this.showUrl = true;
      $("#bam-url").children("input").focus();
    },

    openBamURL : function() {
      let self = this;

      var bamUrl = $("#url-input").val();
      // remove https if present
      if (bamUrl.slice(0,5) == 'https')
        bamUrl = 'http' + bamUrl.slice(5,bamUrl.length);
      this.selectedFileURL = bamUrl;

      var baiUrl = $("#bai-url-input").val();
      // remove https if present
      if (baiUrl.slice(0,5) == 'https')
        baiUrl = 'http' + baiUrl.slice(5,baiUrl.length);
      this.selectedBaiFileURL = baiUrl;

      self.$router.push({name: 'BamView', params: { selectedFileURL: this.selectedFileURL, selectedBaiURL: this.selectedBaiFileURL}});
    },

    processBamFile: function(event){
      let self = this;

      if (event.target.files.length != 2) {
        alert('must select both a .bam and .bai file');
        // return;
      }

      var fileType0 = /[^.]+$/.exec(event.target.files[0].name)[0];
      var fileType1 = /[^.]+$/.exec(event.target.files[1].name)[0];

      var bamFile;
      var baiFile;

      if (fileType0 == 'bam' && fileType1 == 'bai') {
        bamFile = event.target.files[0];
        baiFile = event.target.files[1];
      } else if (fileType1 == 'bam' && fileType0 == 'bai') {
        bamFile = event.target.files[1];
        baiFile = event.target.files[0];
      } else {
        alert('must select both a .bam and .bai file');
        // return;
      }

      self.$router.push({name: 'BamView', params: { selectedBamFile: bamFile, selectedBaiFile: baiFile}});
    }
  }
}


</script>
