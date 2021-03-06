<template>
  <ArticleCollection title="History" :articles="articles" @loadMoreArticles="loadMoreArticles" :maxArticles="maxArticles" />
  <!-- <DefaultTemplate>
    <section>
      <div class="d-flex justify-content-center">
        <div class="small-screen-div">
          <h1>History</h1>
          <span>Last 25 articles read</span>
            <div v-if="data">
              <Article v-for="article in data" :key="article.id" :data="article" />
            </div>
            <div v-else>
              <ArticleSkeleton v-for="index in 4" :key="index" />
            </div>
        </div>
      </div>
    </section>
  </DefaultTemplate> -->
</template>

<script>
import Article from '@/components/Article.vue';
import ArticleSkeleton from '@/components/ArticleSkeleton.vue';
import DefaultTemplate from '@/components/DefaultTemplate.vue';
import ArticleCollection from '@/components/ArticleCollection.vue';
import axios from 'axios';

export default {
  name: 'History',
  components: {
    Article,
    ArticleSkeleton,
    DefaultTemplate,
    ArticleCollection
  },
  mounted(){
      this.getData();
  },
  data(){
    return({
        articles: null,
        page: 1,
        first: true,
        maxArticles: 10
    });
  },
  methods:{
    loadMoreArticles(options){
        this.page++;

        this.getData(options.addToArray);
      },
      getData(addToArray){
        axios.get(`${process.env.VUE_APP_API}/history?max=${this.maxArticles}&offset=${this.page * 10}`,{
          withCredentials: true,
          credentials: 'include'
        })
          .then(response => {
            if(response.status === 200){
              if(this.first){
                this.articles = response.data;
                this.first = false;
              }
              else{
                if(addToArray){
                  response.data.forEach(el => {
                    this.articles.push(el);
                  });
                }
                else{
                  this.articles = response.data;
                }
              }

              this.$eventHub.$emit('articleFetchingDone');
            }
        })
        .catch(error => {
          if(error.response.status === 500)
            this.$router.push({name: "500"});
        })
      }
  }
}
</script>
