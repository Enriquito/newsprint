<template>
<DefaultTemplate>
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
</DefaultTemplate>
</template>

<script>
import Article from '@/components/Article.vue';
import ArticleSkeleton from '@/components/ArticleSkeleton.vue';
import DefaultTemplate from '@/components/DefaultTemplate.vue';
import moment from 'moment-timezone'
import axios from 'axios';

export default {
  name: 'Feed',
  components: {
    Article,
    ArticleSkeleton,
    DefaultTemplate
  },
  mounted(){
    this.getData();
  },
  data(){
    return({
      feed: null,
      newToday: [],
      older: [],
      loadingNewData: false
    });
  },
  methods:{
    getData(){
      axios.get(`${process.env.VUE_APP_API}/feeds/${this.feedId}/?offset=${(this.$route.params.page - 1) * 10}&max=10`,
      {
        withCredentials: true,
        credentials: 'include'
      })
        .then(response => {
          if(response.status === 200){
              this.feed = response.data;
              this.sortArticles();
              this.loadingNewData = false;
          }
      })
      .catch(error => {
        if(error.response.status === 404){
          this.$router.push({name: "NotFound"});
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
    loadMoreArticles(){
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
    },
    nextPage(event){
      event.preventDefault();
      this.loadingNewData = true;
      this.loadMoreArticles();
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
    },
    pageNum(){
       if(this.$route.params.page){
        return this.$route.params.page
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
      width: 1024px;
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
