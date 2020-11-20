<template>
  <div class="d-flex" id="app">
    <Navigation :data="data" />
    <router-view/>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue';
import axios from 'axios'

export default {
  mounted(){
    this.getData();
  },
  data(){
    return({
      data: null
    });
  },
  methods:{
    getData(){
        axios.get(`${process.env.VUE_APP_API}/folders/user/1`)
        .then(response => {
            if(response.status === 200){
                this.$store.commit('setFolders', response.data);
                this.data = response.data;
            }
        });
    }
  },
  components:{
    Navigation
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;1,300;1,500;1,700&display=swap');

html,body, #app
{
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #707070;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
