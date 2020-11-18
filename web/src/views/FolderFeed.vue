<template>
  <section>
    <h1>{{folderName}}</h1>
    <div style="padding-bottom: 50px">
      <span>New today</span>
      <FeedItem v-for="index in 3" :key="index" />
      <span style="margin-top:60px; display:block;">Older articles</span>
      <FeedItem v-for="index in 10" :key="index" />
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
  padding-left: 80px;
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
