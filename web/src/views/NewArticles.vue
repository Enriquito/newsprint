<template>
    <ArticleCollection title="New Articles" :page="page" :newArticlesFound="newArticlesFound" :articles="articles" @loadMoreArticles="loadMoreArticles" :maxArticles="maxArticles" />
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

    this.$eventHub.$on('loadNewFoundArticles', this.loadInNewArticles);

    this.$eventHub.$on('nextPage', () => {
        this.page++;
        this.articles = [];
        this.getData();
    });
    this.$eventHub.$on('prevPage', () => {
        if(this.page === 0)
            return;

        this.page--;
        this.articles = [];
        this.getData();
    });
    this.$eventHub.$on('goToPage', (page) => {
        this.page = page;
        this.articles = [];
        this.getData();
    });

    this.$eventHub.$on('preferencesLoaded', () => {
      this.infiniteScroll = Boolean(this.$store.state.preferences.enableInfiniteScroll);

        this.checkNewArticleIntervalTimes();
    });
  },
  destroyed(){
    clearInterval(this.newArticleInterval);
  },
  data(){
    return({
        articles: [],
        page: 0,
        first: true,
        maxArticles: 10,
        newArticleInterval: null,
        newArticlesFound: false,
        infiniteScroll: false
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

              this.$eventHub.$emit('articleFetching', false);
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
    },
    checkNewArticles(){
      const newFetchedArticles = [];
      let foundNew = false;
      
      axios.get(`${process.env.VUE_APP_API}/unread/articles?max=${this.maxArticles}&offset=0`,{
            withCredentials: true,
            credentials: 'include'
        })
        .then(response => {
          if(response.status === 200){
            response.data.forEach(el => {
              newFetchedArticles.push(el);
            });

            for(let i = 0; i < newFetchedArticles.length; i++){
              let found = false;

              for(let x = 0; x < this.articles.length; x++){
                if(newFetchedArticles[i].id === this.articles[x].id){
                  found = true;
                  break;
                }
              }

              if(!found){
                foundNew = true;
              }
            }
          }

          if(foundNew){
            this.newArticlesFound = true;
            clearInterval(this.newArticleInterval);
          }
        });
    },
    loadInNewArticles(){
      this.$eventHub.$emit('articleFetching', true);
      this.page = 0;
      this.articles = [];
      this.getData();
      this.newArticlesFound = false;
      this.checkNewArticleIntervalTimes();
    },
    startNewArticleSearchInterval(seconds){
      console.log('call');
        this.newArticleInterval = setInterval(this.checkNewArticles, (1000 * seconds));
    },
    checkNewArticleIntervalTimes(){
      if(this.infiniteScroll)
            this.startNewArticleSearchInterval(30);
        else
            this.startNewArticleSearchInterval(120);
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
