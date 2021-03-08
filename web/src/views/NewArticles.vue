<template>
    <ArticleCollection title="New Articles" :articles="articles" @loadMoreArticles="loadMoreArticles" :maxArticles="maxArticles" />
</template>

<script>
import axios from 'axios';
import ArticleCollection from '@/components/ArticleCollection.vue';

export default {
  name: 'NewArticles',
  components: {
    ArticleCollection
  },
  mounted(){
    this.getData();
  },
  data(){
    return({
        articles: [],
        page: 0,
        first: true,
        maxArticles: 10
    });
  },
  methods:{
    getData(addToArray){
        axios.get(`${process.env.VUE_APP_API}/unread/articles?max=${this.maxArticles}&offset=${this.page * 10}`,{
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
            console.log(error);
            if(error.response.status === 500)
            this.$router.push({name: "500"});
        })
    },
    loadMoreArticles(options){
        this.page++;
        this.getData(options.addToArray);
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
      border-radius: 10px;
      margin-top: 50px;
      color: #FFF;
      outline: none;
}
@media (max-width: 720px) {
  button{
    width: 100% !important;
  }
}
</style>
