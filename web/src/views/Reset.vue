<template>
      <section id="login" class="d-flex align-items-center justify-content-center" style="width: 100%; height: 100%; background: #5867FC;">
            <div id="login-container" class="d-flex" style="heigth: 500px;">
                  <div id="form" class="d-flex align-items-center justify-content-center">
                        <div style="width: 100%;">
                              <h5 class="welcome">Reset password for</h5>
                              <h1 class="app-name">Newsprint</h1>
                              <div v-if="validateScreen && !resetSuccess">
                                    <div style="text-align: left; margin-top: 15px;">
                                          <label for="email">Email</label>
                                          <br />
                                          <input type="email" id="email" v-model="email" placeholder="example@domain.com" />
                                    </div>
                                    <div style="text-align: left; margin-top: 15px;">
                                          <label for="token">Token</label>
                                          <br />
                                          <input type="text" id="token" v-model="token" placeholder="Fill in your personal reset token" />
                                    </div>
                                    <div style="height: 25px; color: tomato; margin-top: 20px;">
                                          {{error}}
                                    </div>
                                    <div>
                                          <button @click="validate">{{loginButtonText}}</button>
                                    </div>
                                    <div style="text-align: center; padding-top: 30px">
                                          <span>
                                                Already have an account? <router-link :to="{name: 'Login'}">Sign in</router-link>
                                          </span>
                                    </div>
                              </div>
                              <div v-else-if="!validateScreen && !resetSuccess">
                                    <div style="text-align: left; margin-top: 15px;">
                                          <label for="password">Password</label>
                                          <br />
                                          <input type="password" id="password" v-model="password" placeholder="Password" />
                                    </div>
                                    <div style="text-align: left; margin-top: 15px; margin-top: 20px;">
                                          <label for="retype-password">Retype Password</label>
                                          <br />
                                          <input type="password" id="retype-password" v-model="reTypePassword" placeholder="Retype Password" />
                                    </div>
                                    <div style="height: 25px; color: tomato;">
                                          {{error}}
                                    </div>
                                    <div>
                                          <button @click="changePassword">{{loginButtonText}}</button>
                                    </div>
                              </div>
                              <div style="margin-top: 30px; text-align: center;" v-else>
                                    <h4>Your password has been reset.</h4>
                                    <span>Please return to the <router-link :to="{name: 'Login'}">Login</router-link> page.</span>
                              </div>
                        </div>
                  </div>
            </div>
      </section>
</template>
<script>
import axios from 'axios'

export default {
    name: "Reset",
    mounted(){
        this.token = this.$route.params.token;
    },
    data(){
          return({
                token: null,
                email: null,
                validateScreen: true,
                resetSuccess: false,
                password: null,
                reTypePassword: null,
                error: "",
                loginButtonText: "Validate Token"
          });
    },
    methods:{
      validate(event){
            event.preventDefault();
            this.loginButtonText = "Validating...";

            axios.post(`${process.env.VUE_APP_API}/account/password-reset/validate`, {
                  email: this.email,
                  token: this.token
            },
            {
                  withCredentials: true,
                  credentials: 'include'
            })
            .then(response => {
                  if(response.status === 200){
                        this.validateScreen = false;
                        this.error = "";
                        this.loginButtonText = "Change Password";
                  }
            })
            .catch(error => {
                  this.loginButtonText = "Validate Token";
                  switch(error.response.status){
                        case 404:
                              this.error = "Email and/or token combination not valid.";
                              break;
                        case 401:
                              this.error = "Token is not valid.";
                              break;
                        case 500:
                              this.error = "Error while checking reset request. Please try again later.";
                              break;
                  }
            })
      },
      changePassword(){
            this.loginButtonText = "Updating password...";

            if(this.password === this.reTypePassword){
                  axios.put(`${process.env.VUE_APP_API}/account/password-reset/`, {
                        email: this.email,
                        token: this.token,
                        password: this.password
                  },
                  {
                        withCredentials: true,
                        credentials: 'include'
                  })
                  .then(response => {
                        if(response.status === 200){
                              this.resetSuccess = true;
                              this.error = "";
                        }
                  })
                  .catch(error => {
                        this.loginButtonText = "Reset Password";
                        if(error.response.status === 404){
                              this.error = "Email and/or token combination not valid.";
                        }
                        else if(error.response.status === 500){
                              this.error = "Error while checking reset request. Please try again later.";
                        }
                  })
            }
            else{
                  this.loginButtonText = "Reset Password";
                  this.error = "Passwords does not match.";
            }
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
      /* background: #F6F7F8; */
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
@media (prefers-color-scheme: dark)
{
      span a
      {
            color: rgb(168, 176, 255) !important;
      }
      #login
      {
            background: #333 !important;
            color: #FFF;
      }
      #login #form input
      {
            border: 1px solid #FFFFFF47 !important;
            outline: none;
      }
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