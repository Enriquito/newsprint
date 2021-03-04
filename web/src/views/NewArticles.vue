<template>
<DefaultTemplate>
  <section>
    <div class="d-flex justify-content-center">
      <div class="small-screen-div">
        <h1>New Articles</h1>
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
            </div>
            <div v-else>
              <ArticleSkeleton v-for="index in 6" :key="index" />
            </div>
        </div>
      </div>
    </div>
    </section>
</DefaultTemplate>
</template>

<script>
import Article from '@/components/Article.vue';
import axios from 'axios';
import ArticleSkeleton from '@/components/ArticleSkeleton.vue';
import DefaultTemplate from '@/components/DefaultTemplate.vue';

export default {
  name: 'NewArticles',
  components: {
    Article,
    ArticleSkeleton,
    DefaultTemplate
  },
  updated(){
    if(!this.infiniteScroll)
      this.section.scrollTo(0,0);
  },
  mounted(){
    if(this.$store.state.preferences !== undefined)
      this.infiniteScroll = Boolean(this.$store.state.preferences.enableInfiniteScroll);

    this.page = this.$route.params.page;
    this.getData();
    this.section = document.querySelector('section');
    if(this.infiniteScroll)
      this.section.addEventListener('scroll', this.updateScroll);
  },
  destroy(){
    this.section.removeEventListener('scroll', this.updateScroll)
  },
  data(){
    return({
      articles: null,
      scrollPosition: null,
      section: null,
      infiniteScroll: true,
      firstLoad: true,
      page: 1
    });
  },
  methods:{
    getData(){
      axios.get(`${process.env.VUE_APP_API}/unread/articles?max=10&offset=${this.page * 10}`,{
        withCredentials: true,
        credentials: 'include'
      })
        .then(response => {
          if(response.status === 200){
              if(this.infiniteScroll && !this.firstLoad){
                response.data.forEach(el => {
                  this.articles.push(el);
                });
              }
              else{
                this.articles = response.data;

                if(this.firstLoad)
                  this.firstLoad = false;
              }
          }
      })
      .catch(error => {
        if(error.response.status === 500)
          this.$router.push({name: "500"});
      })
    },
    loadMoreArticles(event){
      event.preventDefault();
      
      if(this.$store.state.preferences.setArticlesReadOnNextPage === 1){
        this.articles.forEach(article => {
          this.setArticleToRead(article.id);
        });
      }
      
      const page = parseInt(this.$route.params.page) + 1;
      this.$router.push({name: 'NewArticles', params: {page: page}});
      this.articles = null;
      this.getData();
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
    },
    updateScroll() {
      this.scrollPosition = this.section.scrollTop;

      if(this.scrollPosition === (this.section.scrollHeight - this.section.clientHeight)){
        if(this.infiniteScroll && !this.firstLoad)
          this.page++;

        this.getData();
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
