<template>
  <div class="content-wrapper">
    <MobileMenuIcon />
    <Navigation />
    <section>
      <h1>New Articles</h1>
      <div style="padding-bottom: 50px">
          <div v-if="articles">
              <div>
                  <Article v-for="article in articles" :key="article.id" :data="article"/>
              </div>
              <button id="load-more-button" @click="loadMoreArticles">
                    Load more articles
              </button>
          </div>
          <div v-else>
            <ArticleSkeleton v-for="index in 6" :key="index" />
          </div>
      </div>
    </section>
  </div>
</template>

<script>
import Article from '@/components/Article.vue';
import axios from 'axios';
import ArticleSkeleton from '@/components/ArticleSkeleton.vue';
import MobileMenuIcon from '@/components/MobileMenuIcon.vue';
import Navigation from '@/components/Navigation.vue';

export default {
  name: 'NewArticles',
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
      articles: null,
    });
  },
  methods:{
    getData(){
      axios.get(`${process.env.VUE_APP_API}/unread/articles?max=10&offset=${this.$route.params.page * 10}`)
        .then(response => {
          if(response.status === 200){
              this.articles = response.data;
          }
      });
    },
    loadMoreArticles(event){
      event.preventDefault();
      const page = parseInt(this.$route.params.page) + 1;
      this.$router.push({name: 'NewArticles', params: {page: page}});
      this.articles = [];
      this.getData();
    }
  }
}
</script>
<style scoped>
button
{
      border: 1px solid rgba(0,0,0,0.1);
      padding: 10px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8em;
      width: 1024px;
      background: none;
      border-radius: 10px;
      margin-top: 50px;
      color: inherit;
      background: #FC7C7C;
      color: #FFF;
      outline: none;
}
</style>
