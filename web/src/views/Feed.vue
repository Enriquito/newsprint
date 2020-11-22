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
          <Article v-for="article in older" :key="article.id" :data="article"/>
      </div>
      <div v-else>
          <h2 style="text-align: center">Loading...</h2>
      </div>
    </div>
  </section>
</template>

<script>
import Article from '@/components/Article.vue';
import moment from 'moment-timezone'
import axios from 'axios';

export default {
  name: 'Feed',
  components: {
    Article
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
      axios.get(`${process.env.VUE_APP_API}/feeds/${this.feedId}`)
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
    }
  },
  watch:{
    feedId(){
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
</style>
