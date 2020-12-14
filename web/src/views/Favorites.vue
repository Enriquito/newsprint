<template>
  <div class="content-wrapper">
    <MobileMenuIcon />
    <Navigation />
    <section>
      <h1>Favorites</h1>
      <div v-if="data">
          <div v-if="data.length > 0">
            <Article v-for="article in data" :key="article.id" :data="article" />
          </div>
          <div v-else>
            <h2>You dont have favorite articles yet.</h2>
            <h5>Click the heart icon right of the article to favorite the article.</h5>
          </div>
      </div>
      <div v-else>
        <ArticleSkeleton v-for="index in 2" :key="index" />
      </div>
    </section>
  </div>
</template>

<script>
import Article from '@/components/Article.vue';
import ArticleSkeleton from '@/components/ArticleSkeleton.vue'
import MobileMenuIcon from '@/components/MobileMenuIcon.vue';
import Navigation from '@/components/Navigation.vue';
import axios from 'axios';

export default {
  name: 'Favorites',
  components: {
    Article,
    ArticleSkeleton,
    Navigation,
    MobileMenuIcon
  },
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
          axios.get(`${process.env.VUE_APP_API}/favorite/articles`)
          .then(response => {
              if(response.status === 200){
                  this.data = response.data;
              }
          })
          .catch(error => {
              console.log(error);
          })
      }
  }
}
</script>