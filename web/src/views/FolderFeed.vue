<template>
  <section>
    <h1>{{folderName}}</h1>
    <div style="padding-bottom: 50px">
      <div v-if="feeds">
        <div v-for="feed in feeds" :key="feed.id">
          <FeedItem v-for="article in feed.articles" :key="article.id" :data="article"/>
        </div>
      </div>
      <div v-else>
        <h2 style="text-align: center">Loading...</h2>
      </div>
    </div>
  </section>
</template>

<script>
import FeedItem from '@/components/FeedItem.vue';

export default {
  name: 'FolderFeed',
  components: {
    FeedItem
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
