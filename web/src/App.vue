<template>
  <div class="d-flex" id="app">
    <router-view />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  updated(){
    if(this.$route.name === 'Login')
      return;

    this.getData();
    this.getNewArticles();

    this.$eventHub.$on('updateNavigation', () => {
      this.getData();
      this.getNewArticles();
    })
  },
  methods:{
    getData(){
      axios.get(`${process.env.VUE_APP_API}/folders`)
      .then(response => {
          if(response.status === 200){
              this.$store.commit('setFolders', response.data);
          }
      })
      .catch(error => {
          alert('Error fetching folders');
          console.log(error);
      })
    },
    getNewArticles(){
        axios.get(`${process.env.VUE_APP_API}/articles/count/unread`)
        .then(response => {
            if(response.status === 200){
                this.unreadArticles = response.data.unreadArticles;
                this.$store.commit('setUnreadArticles', response.data.unreadArticles);
            }
        })
        .catch(error => {
            alert('Error fetching new articles');
            console.log(error);
        })
    },
  },
  watch: {
        $route: {
            immediate: true,
            handler(to, from) {
              document.title = to.meta.title || process.env.VUE_APP_NAME;
            }
        },
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;1,300;1,500;1,700&display=swap');

body
{
  background-color: #fbf8f8;
}
html,body, #app
{
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
#app
{
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #707070;
  overflow: hidden;
}
section
{
  width: 100%;
  height: 100%;
  text-align: start;
  padding: 0 50px;
  overflow-y: scroll;
}
section h1
{
    font-size: 70px;
    font-weight: 500;
    font-style: italic;
    margin-top: 70px;
    margin-bottom: 60px;
}
section span
{
  font-weight: 100;
  font-size: 25px;
  font-style: italic;
}
.content-wrapper
{
  overflow: hidden;
  width: 100%;
}
@media (max-width: 720px) {
    section{
        padding: 10px !important;
        padding-left: none;
        margin: 0 !important;
    }
    section h1{
      width: auto !important;
      font-size: 40px !important;
    }
}
@media (max-width: 1500px) {
  .small-screen-div
  {
    width: 100%;
  }
}
</style>
