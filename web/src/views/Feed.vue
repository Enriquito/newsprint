<template>
  <ArticleCollection v-if="feed" title="Loading..." :feed="feed" :articles="feed.articles" @loadMoreArticles="loadMoreArticles" :maxArticles="maxArticles" />
</template>

<script>
import moment from 'moment-timezone'
import ArticleCollection from '@/components/ArticleCollection.vue';
import axios from 'axios';

export default {
  name: 'Feed',
  components: {
    ArticleCollection
  },
  mounted(){
    this.getData();
  },
  data(){
    return({
        page: 0,
        first: true,
        maxArticles: 10,
        feed: {articles:[]},
        newToday: [],
        older: []
    });
  },
  methods: {
    getData(addToArray){
      axios.get(`${process.env.VUE_APP_API}/feeds/${this.feedId}/?offset=${this.page * 10}&max=${this.maxArticles}`,
      {
        withCredentials: true,
        credentials: 'include'
      })
      .then(response => {
            if(response.status === 200){
              if(this.first){
                this.feed = response.data;
                this.first = false;
              }
              else{
                if(addToArray){
                  response.data.articles.forEach(el => {
                    this.feed.articles.push(el);
                  });
                }
                else{
                  this.feed = response.data;
                }
              }

              this.$eventHub.$emit('articleFetching', false);
            }
        })
        .catch(error => {
            console.log(error);
            if(error.response.status === 500)
              this.$router.push({name: "500"});
            else if(error.response.status === 404)
              this.$router.push({name: "404"});
        });
    },
    loadMoreArticles(options){
        this.page++;
        this.getData(options.addToArray);
    }  
  },
  watch:{
    feedId(){
      this.feed = null;
      this.getData();
    },
    pageNum(){
      this.older = [];
      this.new = [];
      this.getData();
    }
  },
  computed:{
    feedId(){
      if(this.$route.params.feedId){
        return this.$route.params.feedId
      }
      else
        return ""
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
      width: 640px;
      background: none;
      border-radius: 10px;
      margin-top: 50px;
      color: inherit;
      background: #5867FC;
      color: #FFF;
      outline: none;
}
@media (max-width: 720px) {
  button{
    width: 100% !important;
  }
}
</style>
