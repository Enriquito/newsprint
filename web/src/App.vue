<template>
  <div class="d-flex" id="app">
    <Navigation v-if="!isLoginPage" />
    <router-view/>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue';

export default {
  name: "App",
  components:{
    Navigation
  },
  computed:{
    isLoginPage(){
      if(this.$route.name === 'Login')
        return true;
      else
        return false;
    }
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
</style>
