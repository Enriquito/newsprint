<template>
    <ArticleCollection title="History" :articles="articles" @loadMoreArticles="loadMoreArticles" :maxArticles="maxArticles" />
</template>

<script>
import ArticleCollection from '@/components/ArticleCollection.vue';
import axios from 'axios';

export default {
  name: 'History',
  components: {
    ArticleCollection
  },
  mounted(){
      this.getData();
  },
  data(){
    return({
        articles: null,
        page: 0,
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
