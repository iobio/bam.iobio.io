<style type="text/css" scoped>
  body {
    font-family: Quicksand;
    font-weight: 300;
    width: 100% ;
  }
  header {
    font-size: 46px;
    color:#2d8fc1;
    text-align: left;
    /*padding-left: 10px;*/
  }
  a:visited {
    color:none;
  }
  a, a:hover {
    text-decoration:none;
    color:#2d8fc1;
  }
  .iobio-project {
    float: right;
    /*padding-top: 20px;*/
    font-size:18px;
    letter-spacing:6px;
    margin-top:8px;
    margin-right: 33px;
    color: rgb(120,120,120)
  }
  .iobio-project a {
    color: rgb(120,120,120)
  }

</style>

<template>
  <div >
    <body>
      <header>
        <a href="http://bam.iobio.io">bam<span style="color:rgb(200,200,200)">.iobio</span></a>
        <div class="iobio-project" >
          <a href="http://iobio.io" style="margin: 0px 5px 0px 5px;">an iobio project</a>
        </div>
      </header>
    </body>
  </div>
</template>

<script>
export default {
  name: 'app-header',
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>
