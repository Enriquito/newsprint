<template>
      <section id="login" class="d-flex align-items-center justify-content-center" style="width: 100%; height: 100%; background: #5867FC;">
            <div id="login-container" class="d-flex" style="heigth: 500px;">
                  <div id="form" class="d-flex align-items-center justify-content-center">
                        <div style="width: 100%;">
                              <h5 class="welcome">Reset password</h5>
                              <h1 class="app-name">Newsprint</h1>
                              <div v-if="!emailHasBeenSend">
                                    <div style="text-align: left; margin-top: 15px;">
                                          <label for="email">Email</label>
                                          <br />
                                          <input type="email" id="email" v-model="email" placeholder="example@domain.com" />
                                    </div>
                                    <div style="height: 25px; color: tomato;">
                                          {{error}}
                                    </div>
                                    <div>
                                          <button @click="requestPasswordReset">{{loginButtonText}}</button>
                                    </div>
                                    <div style="text-align: center; padding-top: 30px">
                                          <span>
                                                No need for a password reset? <router-link :to="{name: 'Login'}">Sign in here</router-link>
                                          </span>
                                    </div>
                              </div>
                              <div style="margin-top: 30px; text-align: center;" v-else>
                                    <h4>Your password reset link has been send if the email address exists.</h4>
                                    <router-link :to="{name: 'Login'}">Login</router-link>
                              </div>
                        </div>
                  </div>
            </div>
      </section>
</template>
<script>
import axios from 'axios'

export default {
    name: "PasswordReset",
    data(){
          return({
                username: null,
                email: null,
                error: "",
                emailHasBeenSend: false,
                loginButtonText: "Request Password Reset"
          });
    },
    methods:{
          requestPasswordReset(event){
                  event.preventDefault();
                  this.loginButtonText = "Requesting...";

                  axios.post(`${process.env.VUE_APP_API}/account/request/password-reset`, {
                        email: this.email
                  },
                  {
                        withCredentials: true,
                        credentials: 'include'
                  })
                  .then(response => {
                        if(response.status === 200){
                              this.emailHasBeenSend = true;
                        }
                  })
                  .catch(error => {
                        this.loginButtonText = "Request Password Reset";

                        if(error.response.status === 500){
                              this.error = "Error while checking reset request. Please try again later.";
                        }
                  })
          }
    }
}
</script>
<style scoped>
section{
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
}
section h1{
      margin-top: 0px !important;
      margin-bottom: 0px !important;
}
section span
{
  font-weight: inherit !important;
  font-size: inherit !important;
  font-style: inherit !important;
}
#login
{
      height: 500px;
      border: 1px solid rgba(0,0,0,1);
}
#login #form
{
      padding: 50px;
      background: #F6F7F8;
      border-radius: 15px;
      width: 500px;
}
#login #form span a
{
      color: #5867FC;
}
#login #form h1
{
      text-align: center;
}
#login #form h1.app-name
{
      color: #5867FC !important;
      font-weight: 900;
      margin-top: -15px !important;
      font-size: 2em !important;
      width: auto;
}
#login #form h5.welcome
{
      font-size: 1.5em;
      text-align: center;
}
#login #form label
{
      margin: 0;
}
#login #form input, button
{
      border-radius: 5px;
      background: none;
      border: 1px solid rgba(0,0,0,0.1);
      width: 100%;
      padding: 10px;
      outline-color: #5867FC;
      color: inherit;
}
#login #form button
{
      margin-top: 10px;
      background: #5867FC;
      outline: none;
      color: #FFF;
      font-weight: 900;
      margin-top: 15px;
}
@media (max-width: 720px) {
      #login div
      {
            width: 100%;
            padding: 0 10px;
      }
      #login #form
      {
            width: 100% !important;
            padding: 10px;
            padding: 30px 0px;
      }
}
</style>