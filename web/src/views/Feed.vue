<template>
  <section>
    <h1 v-if="feed">{{feed.title}}</h1>
    <h1 v-else>Loading...</h1>

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
          <button id="load-more-button" @click="loadMoreArticles">Load more articles</button>
        </div>
        <div v-else>
          <h2>No Articles found</h2>
        </div>
      
      </div>
      <div v-else>
          <ArticleSkeleton v-for="index in 4" :key="index" />
      </div>
    </div>
  </section>
</template>

<script>
import Article from '@/components/Article.vue';
import ArticleSkeleton from '@/components/ArticleSkeleton.vue';
import moment from 'moment-timezone'
import axios from 'axios';

export default {
  name: 'Feed',
  components: {
    Article,
    ArticleSkeleton
  },
  mounted(){
    this.getData();
  },
  data(){
    return({
      feed: null,
      newToday: [],
      older: []
    });
  },
  methods:{
    getData(){
      axios.get(`${process.env.VUE_APP_API}/feeds/${this.feedId}/?offset=${(this.$route.params.page - 1) * 10}&max=${this.$route.params.page * 10}`)
        .then(response => {
          if(response.status === 200){
              this.feed = response.data;
              this.sortArticles();
          }
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
    loadMoreArticles(event){
      event.preventDefault();
      const page = parseInt(this.$route.params.page) + 1;
      this.$router.push({
        name: 'Feed', 
        params: {
          page: page,
          feedId: this.$route.params.feedId, 
          feedName: this.$route.params.feedName,
        }
        });
      this.older = [];
      this.new = [];
      this.getData();
    }
  },
  watch:{
    feedId(){
      this.feed = null;
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
