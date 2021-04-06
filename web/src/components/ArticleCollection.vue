<template>
      <DefaultTemplate>
            <section class="d-flex justify-content-center">
                  <div class="d-flex">
                        <div class="small-screen-div">
                            <div v-if="feed">
                                <h1 v-if="feed.displayName != null">{{feed.displayName}}</h1>
                                <h1 v-else>{{feed.title}}</h1>
                            </div>
                            <h1 v-else>{{title}}</h1>

                              <div style="padding-bottom: 50px">
                                    <div v-if="articles">
                                          <div v-if="articles.length > 0">
                                                <Article v-for="article in articles" :key="article.id" :data="article"/>

                                                <div v-if="fetchingData">
                                                      <ArticleSkeleton v-for="index in 2" :key="index" />
                                                </div>
                                          </div>
                                          <div v-if="articles.length == 0 && !fetchingData">
                                                <h2>No articles found.</h2>
                                          </div>

                                          <button v-if="articles.length > 0 && articles.length == 10 && !infiniteScroll" id="load-more-button" class="theme-color-background" @click="loadMoreArticles">
                                                Load more articles
                                          </button>
                                          
                                          <div v-if="articles.length == 0">
                                                <ArticleSkeleton v-for="index in 6" :key="index" />
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
                  <!-- <FeedRecommendation /> -->
            </section>
      </DefaultTemplate>
</template>

<script>
import Article from '@/components/Article.vue';
import ArticleSkeleton from '@/components/ArticleSkeleton.vue';
import DefaultTemplate from '@/components/DefaultTemplate.vue';
import FeedRecommendation from '@/components/FeedRecommendation.vue';

export default {
      name: "ArticleCollection",
      props: {
            articles: Array,
            title: String,
            maxArticles: Number,
            feed: {
                type: Object,
                required: false
            }
      },
      components: {
            Article,
            ArticleSkeleton,
            DefaultTemplate,
            FeedRecommendation
      },
      data(){
            return({
                  scrollPosition: null,
                  section: null,
                  infiniteScroll: false,
                  fetchingData: true,
                  isSetAutoRead: false,
                  lastArticleCount: 0
            });
      },
      updated(){
            if(!this.infiniteScroll)
                this.section.scrollTo(0,0);
      },
      mounted(){
            this.$eventHub.$on('preferencesLoaded', () => {
                  this.infiniteScroll = Boolean(this.$store.state.preferences.enableInfiniteScroll);
                  this.isSetAutoRead =  Boolean(this.$store.state.preferences.setArticlesReadOnNextPage);

                  if(this.infiniteScroll)
                        this.section.addEventListener('scroll', this.updateScroll);
            });

            this.$eventHub.$on('articleFetchingDone', () => {
                  this.fetchingData = false;
            }); 
            
            this.section = document.querySelector('section');
      },
      destroy(){
            this.section.removeEventListener('scroll', this.updateScroll)
      },
      methods: {
            loadMoreArticles(){
                  this.$emit('loadMoreArticles', {addToArray : this.infiniteScroll});
            },
            updateScroll() {
                  if(this.articles.length === this.lastArticleCount && !this.fetchingData){
                        this.fetchingData = false;
                        return;
                  }
                        
                  const max = (this.section.scrollHeight - this.section.clientHeight);
                  
                  if(this.section.scrollTop > max - 300 && !this.fetchingData){
                        this.fetchingData = true;

                        if(this.isSetAutoRead === true){
                              this.articles.forEach(article => {
                                    if(article.isRead == false)
                                          this.setArticleToRead(article.id);
                              });
                        }
                        this.lastArticleCount = this.articles.length

                       this.loadMoreArticles();
                  }
            },
            setArticleToRead(id){
                  axios.put(`${process.env.VUE_APP_API}/articles/set/read`,{
                        id: id
                  },{
                        withCredentials: true,
                        credentials: 'include'
                  })
                  .catch(error => {
                        console.log(error);
                  });
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