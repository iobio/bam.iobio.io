<style lang='scss' scoped>
#main {
  font-size: 16px;
}

textarea {
  width: 500px;
  height: 200px;
}

.input-container {
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
}

.email-input {
  width: 500px;
}

</style>

<template>
  <div id='main' style="width: 500px; margin-left:auto;margin-right:auto;margin-top: 100px">
    You can use the form below to submit an issue. Please include a brief
    description of your problem. We'll email you as soon as possible to follow
    up, and get more information if necessary. If you think your problem is
    related to the new version of bam, you can click the link below to
    temporarily access the old bam. Please note that old bam is on its way out.
    If you can provide us with any information by submitting an issue, it will
    help the transition to new bam go more smoothly for everyone. Thank you!

    <div class='input-container'>
      Email:
      <input v-model='email' type='text' class='email-input' />
    </div>

    <div class='input-container'>
      Problem Description:
      <textarea v-model='message'></textarea>
      <button @click='onSubmit' >Submit</button>
    </div>

    <a @click='oldBam'>Take me to the old bam</a>
  </div>
</template>

<script>

  export default {
    name: 'help',
    components: {

    },
    props: [],
    data() {
      return {
        email: '',
        message: '',
      }
    },
    methods: {
      oldBam: function() {
        console.log("to old bam");
      },

      onSubmit: function() {
        console.log("submit");
        fetch('http://localhost:3000/submit_issue', {
          method: 'POST',
          body: JSON.stringify({
            email: this.email,
            message: this.message,
          }),
        })
        .then(response => {
          console.log("submit response");
        })
        .catch(err => {
          throw new Error(err);
        });
      }
    }
  }
</script>
