<template>
<ArticleCollection v-if="feed" title="Loading..." :feed="feed" :articles="feed.articles" @loadMoreArticles="loadMoreArticles" :maxArticles="maxArticles" />

<!-- <DefaultTemplate>
  <section>
    <div class="d-flex justify-content-center">
      <div class="small-screen-div">
        <div v-if="feed">
          <h1 v-if="feed.displayName != null">{{feed.displayName}}</h1>
          <h1 v-else>{{feed.title}}</h1>
        </div>
        <div v-else>
          <h1>Loading...</h1>
        </div>

        <div style="padding-bottom: 50px">
            <div v-if="feed && newToday.length > 0">
                <span>New today</span>
                <div>
                    <Article v-for="article in newToday" :key="article.id" :data="article"/>
                </div>
                <div style="border: 1px solid rgba(0,0,0,0.1); margin-top: 60px;"></div>
            </div>

          <div style="margin-top:60px; display:block;"></div>
          <div v-if="feed">
            <div  v-if="older.length > 0">
              <Article v-for="article in older" :key="article.id" :data="article"/>
            </div>
            <div v-else-if="newToday.length != 10">
              <h2 v-if="!loadingNewData">No Articles found</h2>
            </div>

            <div v-if="(older.length + newToday.length) == 10">
              <button id="load-more-button" @click="nextPage">Load more articles</button>
            </div>

          </div>
          <div v-else-if="!feed || loadingNewData">
              <ArticleSkeleton v-for="index in 4" :key="index" />
          </div>
        </div>
      </div>
    </div>
    </section>
</DefaultTemplate> -->
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
  updated(){
    // document.querySelector('section').scrollTo(0,0);
  },
  data(){
    return({
        articles: null,
        page: 0,
        first: true,
        maxArticles: 10,
        feed: null,
        newToday: [],
        older: []
    });
  },
  methods:{
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
                // this.sortArticles();
              }
              else{
                if(addToArray){
                  response.data.articles.forEach(el => {
                    this.feed.articles.push(el);
                    // this.sortArticles();
                  });
                }
                else{
                  this.feed = response.data;
                }
              }

              this.$eventHub.$emit('articleFetchingDone');
            }
        })
        .catch(error => {
            console.log(error);
            if(error.response.status === 500)
            this.$router.push({name: "500"});
        });
    },
    sortArticles(){
        this.newToday = [];
        this.older = [];

        this.feed.articles.forEach(article => {
            const postDate = moment(article.isoDate);
            const now = moment();

            if(postDate.format('D-MM-YYYY') === now.format('D-MM-YYYY'))
                this.newToday.push(article);
            else
                this.older.push(article);
        });
    },
    // loadMoreArticles(){
    //   const page = parseInt(this.$route.params.page) + 1;
    //   this.$router.push({
    //     name: 'Feed',
    //     params: {
    //       page: page,
    //       feedId: this.$route.params.feedId,
    //       feedName: this.$route.params.feedName,
    //     }
    //     });
    //   this.older = [];
    //   this.new = [];
    //   this.getData();
    // },
    // nextPage(event){
    //   event.preventDefault();
      
    //   if(this.$store.state.preferences.setArticlesReadOnNextPage === 1){
    //     this.feed.articles.forEach(article => {
    //       this.setArticleToRead(article.id);
    //     });
    //   }

    //   this.feed = null;
    //   this.loadMoreArticles();
    // },
    // setArticleToRead(id){
    //     axios.put(`${process.env.VUE_APP_API}/articles/set/read`,{
    //       id: id
    //     },{
    //       withCredentials: true,
    //       credentials: 'include'
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
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
