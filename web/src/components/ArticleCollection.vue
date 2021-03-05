<template>
      <DefaultTemplate>
            <section>
                  <div class="d-flex justify-content-center">
                        <div class="small-screen-div">
                              <h1>{{title}}</h1>

                              <div style="padding-bottom: 50px">
                                    <div v-if="articles">
                                          <div v-if="articles.length > 0">
                                                <Article v-for="article in articles" :key="article.id" :data="article"/>
                                          </div>
                                          <div v-else>
                                                <h2>No articles found.</h2>
                                          </div>

                                          <button v-if="articles.length > 0 && !infiniteScroll" id="load-more-button" class="theme-color-background" @click="loadMoreArticles">
                                                Load more articles
                                          </button>
                                          
                                          <div v-if="articles.length == 0">
                                                <ArticleSkeleton v-for="index in 6" :key="index" />
                                          </div>
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

export default {
      name: "ArticleCollection",
      props: {
            articles: Array,
            title: String
      },
      components: {
            Article,
            ArticleSkeleton,
            DefaultTemplate
      },
      data(){
            return({
                  scrollPosition: null,
                  section: null,
                  infiniteScroll: false,
                  fetchingData: false
            });
      },
      updated(){
            if(!this.infiniteScroll)
                  this.section.scrollTo(0,0);
            this.fetchingData = false;
      },
      mounted(){
            if(this.$store.state.preferences !== undefined)
                  this.infiniteScroll = Boolean(this.$store.state.preferences.enableInfiniteScroll);
            
            this.section = document.querySelector('section');

            if(this.infiniteScroll)
                  this.section.addEventListener('scroll', this.updateScroll);
      },
      destroy(){
            this.section.removeEventListener('scroll', this.updateScroll)
      },
      computed:{
            preferences(){
                  return this.$store.state.preferences
            }
      },
      watch:{
            preferences(n,o){
                  alert(n);
            }
      },
      methods: {
            loadMoreArticles(){
                  this.$emit('loadMoreArticles', {addToArray : this.infiniteScroll});
            },
            updateScroll() {
                  const max = (this.section.scrollHeight - this.section.clientHeight);
                  
                  if(this.section.scrollTop > max - 300 && !this.fetchingData){
                        this.fetchingData = true;

                        if(this.$store.state.preferences.setArticlesReadOnNextPage === 1){
                              this.articles.forEach(article => {
                                    this.setArticleToRead(article.id);
                              });
                        }

                        this.$emit('loadMoreArticles', {addToArray : this.infiniteScroll});
                  }
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