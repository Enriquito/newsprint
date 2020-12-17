<template>
      <section id="login" class="d-flex align-items-center justify-content-center" style="width: 100%; height: 100%;">
            <div class="d-flex" style="heigth: 500px; box-shadow: rgba(0, 0, 0, 0.2) -4px 0 20px 1px; border-radius: 5px;">
                  <div id="whats-new">
                  <h1></h1>
                  </div>
                  <div id="form" class="d-flex align-items-center justify-content-center">
                        <div style="width: 100%;">
                              <h5 class="welcome">Welcome to</h5>
                              <h1 class="app-name">Newsprint</h1>
                              <div>
                                    <div style="text-align: left;">
                                          <label for="username">Username</label>
                                          <br />
                                          <input v-on:keyup.enter="login" type="text" id="username" v-model="username" placeholder="Username" />
                                    </div>
                                    <div style="text-align: left; margin-top: 15px;">
                                          <label for="password">Password</label>
                                          <br />
                                          <input v-on:keyup.enter="login" type="password" id="password" v-model="password" placeholder="Password" />
                                          <div style="text-align: right; margin: 5px;">
                                                <span>
                                                      <router-link :to="{name: 'Register'}">Forgot password?</router-link>
                                                </span>
                                          </div>
                                          <div style="height: 25px; color: tomato;">
                                                {{error}}
                                          </div>
                                    </div>
                                    <div>
                                          <button @click="login">{{loginButtonText}}</button>
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
    name: "Login",
    data(){
          return({
                password: null,
                username: null,
                error: "",
                loginButtonText: "Login"
          });
    },
    methods:{
      login(event){
            event.preventDefault();
            this.loginButtonText = "Loading...";

            axios.post(`${process.env.VUE_APP_API}/login`, {
                  username: this.username,
                  password: this.password
            },
            {withCredentials: true})
            .then(response => {
                  if(response.status === 200){
                        this.$eventHub.$emit('updateNavigation');

                        setTimeout(() => {
                              this.$router.push({name: 'NewArticles', params:{page: 1}});
                        }, 1000)
                  }
            })
            .catch(error => {
                  this.loginButtonText = "Login";

                  if(error.response.status === 401 || error.response.status === 400){
                    this.error = "Password or username is incorrect";
                    console.log("Password or username is incorrect");
                  }
                  else if(error.response.status === 500){
                        this.error = "Internal server error";
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
#login #whats-new
{
      background: #5867FC;
      color: #FFF;
      padding: 20px;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      width: 500px;
      padding: 50px;
}
#login #whats-new h1
{
      text-align: center;
}
#login #form
{
      padding: 50px;
      background: #F6F7F8;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
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
}
@media (max-width: 720px) {
  #login div
  {
    display: block !important;
    width: 100%;
    box-shadow: none !important;
  }
  #login #form
  {
        width: 100% !important;
        padding: 10px;
  }
  #login #whats-new
  {
        width: 100% !important;
        border-radius: 0px !important;
  }
}
</style>