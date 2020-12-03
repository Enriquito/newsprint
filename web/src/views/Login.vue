<template>
      <section id="login" class="d-flex">
            <div id="whats-new">
                  <h1>What is new</h1>
            </div>
            <div id="form" class="d-flex align-items-center justify-content-center">
                  <div style="width: 100%;">
                        <h1>Login into</h1>
                        <h1>Readster</h1>
                        <div>
                              <label for="username">Username</label>
                              <br />
                              <input type="text" id="username" v-model="username" placeholder="Username" />
                              <br />
                              <label for="password">Password</label>
                              <br />
                              <input type="password" id="password" v-model="password" placeholder="Password" />
                              <br />
                              <button>Login</button>
                        </div>
                  </div>
            </div>
      </section>
</template>
<script>

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
      
    }
}
</script>
<style scoped>
#login
{
      height: 500px;
}
#login #whats-new
{
      background: #5867FC;
      color: #FFF;
      padding: 20px;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      width: 500px;
}
#login #whats-new h1
{
      text-align: center;
}
#login #form
{
      padding: 20px;
      background: #F6F7F8;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      width: 500px;
}
#login #form h1
{
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