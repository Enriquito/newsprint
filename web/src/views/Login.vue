<template>
      <section id="login" class="d-flex align-items-center justify-content-center" style="width: 100%; height: 100%;">
            <div class="d-flex" style="heigth: 500px">
                  <div id="whats-new">
                  <h1>What is new</h1>
                  </div>
                  <div id="form" class="d-flex align-items-center justify-content-center">
                        <div style="width: 100%;">
                              <h1 class="welcome">Welcome to</h1>
                              <h1 class="app-name">Readster</h1>
                              <div>
                                    <div style="text-align: left;">
                                          <label for="username">Username</label>
                                          <br />
                                          <input type="text" id="username" v-model="username" placeholder="Username" />
                                    </div>
                                    <div style="text-align: left; margin-top: 15px;">
                                          <label for="password">Password</label>
                                          <br />
                                          <input type="password" id="password" v-model="password" placeholder="Password" />
                                          <div style="text-align: right; margin: 5px;">
                                                <span>
                                                      <router-link :to="{name: 'Register'}">Forgot password?</router-link>
                                                </span>
                                          </div>
                                    </div>
                                    <div>
                                          <button @click="login">Login</button>
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
                username: null
          });
    },
    components: {
          
    },
    methods:{
      login(event){
            event.preventDefault();

            axios.post(`${process.env.VUE_APP_API}/login`, {
                  username: this.username,
                  password: this.password
            }, 
            {withCredentials: true})
            .then(response => {
                  if(response.status === 200){
                        this.$router.push({path: '/'});
                  }
            })
            .catch(error => {
                  console.log(error);
            })
      }
    }
}
</script>
<style scoped>
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
      margin-top: -20px;
}
#login #form h1.welcome
{
      font-size: 1.5em;
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
}
#login #form button
{
      margin-top: 10px;
      background: #5867FC;
      outline: none;
      color: #FFF;
      font-weight: 900;
}

</style>