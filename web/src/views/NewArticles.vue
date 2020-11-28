<template>
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
          <h3>No articles found</h3>
        </div>
    </div>
  </section>
</template>

<script>
import Article from '@/components/Article.vue';
import axios from 'axios';

export default {
  name: 'NewArticles',
  components: {
    Article
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
      axios.get(`${process.env.VUE_APP_API}/unread/articles/${(this.$route.params.page - 1) * 10}/${this.$route.params.page * 10}`)
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
section
{
  width: 100%;
  height: 100%;
  text-align: start;
  padding-left: 50px;
  margin-left: 350px;
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
