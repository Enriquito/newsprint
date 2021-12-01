<template>
      <section id="login" class="d-flex align-items-center justify-content-center" style="width: 100%; height: 100%; background: #5867FC;">
            <div id="login-container" class="d-flex" style="heigth: 500px;">
                  <div id="form" class="d-flex align-items-center justify-content-center">
                        <div style="width: 100%;">
                              <h5 class="welcome">Sing up for</h5>
                              <h1 class="app-name">Newsprint</h1>
                              <div>
                                    <div style="text-align: left;">
                                          <label for="username">Username</label>
                                          <br />
                                          <input type="text" id="username" v-model="username" placeholder="Username" />
                                    </div>
                                    <div style="text-align: left; margin-top: 15px;">
                                          <label for="email">Email</label>
                                          <br />
                                          <input type="email" id="email" v-model="email" placeholder="example@domain.com" />
                                    </div>
                                    <div style="text-align: left; margin-top: 15px;">
                                          <label for="password">Password</label>
                                          <br />
                                          <input type="password" id="password" v-model="password" placeholder="Password" />
                                    </div>
                                    <div>
                                          <button @click="signUp">{{loginButtonText}}</button>
                                    </div>
                                    <div style="text-align: center; padding-top: 30px">
                                          <span>
                                                Already have an account? <router-link :to="{name: 'Login'}">Login</router-link>
                                          </span>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      </section>
</template>
<script>
import axios from 'axios'

export default {
    name: "SignUp",
    data(){
          return({
                password: null,
                username: null,
                email: null,
                error: "",
                loginButtonText: "Sign up"
          });
    },
    methods:{
      signUp(event){
            event.preventDefault();
            this.loginButtonText = "Setting up account...";

            axios.post(`${process.env.VUE_APP_API}/users`, {
                  username: this.username,
                  email: this.email,
                  password: this.password
            },
            {
                  withCredentials: true,
                  credentials: 'include'
            })
            .then(response => {
                  if(response.status === 201){
                        this.login();
                  }
            })
            .catch(error => {
                  this.loginButtonText = "Sing up";

                  if(error.response.status === 500){
                        this.error = "Error while creating user. Please try again later.";
                  }
            })
      },
      login(){
            axios.post(`${process.env.VUE_APP_API}/login`, {
                  username: this.username,
                  password: this.password
            },
            {
                  withCredentials: true,
                  credentials: 'include'
            })
            .then(response => {
                  if(response.status === 200){
                        this.$eventHub.$emit('updateNavigation');

                        setTimeout(() => {
                              this.$router.push({name: 'NewArticles', params:{page: 1}});
                        }, 1000)
                  }
            })
            .catch(error => {
                  if(error.response.status === 401 || error.response.status === 400){
                    this.error = "Password or username is incorrect";
                    console.log("Password or username is incorrect");
                  }
                  else if(error.response.status === 500){
                        this.error = "Error while loging in try again later.";
                  }
            })
      }
    }
}
</script>
<style scoped>
section
{
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
}
section h1
{
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
            /* color: rgb(168, 176, 255) !important; */
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