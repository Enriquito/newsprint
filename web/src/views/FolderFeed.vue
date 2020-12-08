<template>
  <div>
    <MobileMenuIcon />
    <Navigation />
    <section>
      <h1>{{folderName}}</h1>
      <div style="padding-bottom: 50px">
        <div v-if="feeds">
          <div v-for="feed in feeds" :key="feed.id">
            <Article v-for="article in feed.articles" :key="article.id" :data="article"/>
          </div>
        </div>
        <div v-else>
          <ArticleSkeleton v-for="index in 4" :key="index" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Article from '@/components/Article.vue';
import MobileMenuIcon from '@/components/MobileMenuIcon.vue';
import ArticleSkeleton from '@/components/ArticleSkeleton.vue';
import Navigation from '@/components/Navigation.vue';

export default {
  name: 'FolderFeed',
  components: {
    Article,
    ArticleSkeleton,
    Navigation,
    MobileMenuIcon
  },
  mounted(){
    this.getData();
  },
  data(){
    return({
      folders: null,
      feeds: []
    });
  },
  methods:{
    getData(){
      const inter = setInterval(() => {
        if(this.folders){
          clearInterval(inter);
          this.getCurrentFolder();
        }

        this.folders = this.$store.state.folders;
      }, 500);
    },
    getCurrentFolder(){
      this.folders.forEach(folder => {
        if(this.folderName === 'All'){
          this.folders.forEach(folder => {
            this.feeds.push(folder.feeds);
          });
        }
        else if(folder.name === this.folderName){
          this.feeds = folder.feeds;
          return;
        }
      });
    }
  },
  watch:{
    folderName(newVal, oldVal){
      this.getCurrentFolder();
      console.log(`${newVal} ${oldVal}`);
    }
  },
  computed:{
    folderName(){
      if(this.$route.params.folder){
        return this.$route.params.folder
      }
      else
        return ""
    }
  }
}
</script>