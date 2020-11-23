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
      limit: {
            min: 0,
            max: 20
      }
    });
  },
  methods:{
    getData(){
      axios.get(`${process.env.VUE_APP_API}/unread/articles/${(this.$router.params.page - 1) * 20}/${this.$router.params.page * 20}`)
        .then(response => {
          if(response.status === 200){
              this.articles = response.data;
          }
      });
    },
    loadMoreArticles(){
          const page = this.$router.params.page;
          this.limit.min = page * 20;
          this.limit.max += page * 20;

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
}
</style>
