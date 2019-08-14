<style lang='scss' scoped>

$main-color: #2d8fc1;

#main {
  font-size: 18px;
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

#submit-btn {
  margin-bottom: 20px;
}

</style>

<template>
  <div id='main' style="width: 500px; margin-left:auto;margin-right:auto;margin-top: 100px">

    <h1>Submit an issue</h1>

    <p>
      You can use the form below to submit an issue. Please include a
      description of your problem. We'll email you as soon as possible to
      follow up, and get more information if necessary. 
    </p>

    <p>
      If you have any trouble with the form, you can also email us directly
      at <a href='mailto:iobioproject@gmail.com'>iobioproject@gmail.com</a>. 
    </p>

    <div class='input-container'>
      Email:
      <input v-model='email' type='text' class='email-input' />
    </div>

    <div class='input-container'>
      Problem Description:
      <textarea v-model='message'></textarea>
      <button id='submit-btn' @click='onSubmit' >Submit</button>
    </div>
  </div>
</template>

<script>

  import Cookie from 'js-cookie';


  function validEmailAddress(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

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

      onSubmit: function() {

        if (validEmailAddress(this.email)) {
          fetch('http://nv-dev-new.iobio.io/issued/submit_issue', {
            method: 'POST',
            body: JSON.stringify({
              email: this.email,
              message: this.message,
            }),
          })
          .then(response => {
            if (response.status !== 200) {
              alert("Submission failed. Please make sure you provide a description and try again");
            }
            else {
              alert("Submission successful. We'll be in touch soon. Thank you!");
              this.email = '';
              this.message = '';
            }
          })
          .catch(err => {
            throw new Error(err);
          });
        }
        else {
          alert("Invalid email address");
        }
      }
    }
  }
</script>
