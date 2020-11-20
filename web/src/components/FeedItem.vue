<template>
    <figure @click="open" class="d-flex">
      <img :src="searchImage()" alt="plaatje" />
      <figcaption>
        <h2>{{data.title}}</h2>
        <span class="date-time">November 18, 20:10</span><span v-if="data.creator" class="spacer">by</span><strong v-if="data.creator" class="author">Enrique Kreuk</strong>
        <div v-if="isOpen" style="max-height:1500px;" id="article-content" v-html="content"></div>
        <div v-else id="article-content" v-html="content"></div>
      </figcaption>
    </figure>
</template>
<script>
export default {
    name: "FeedItem",
    mounted(){
      this.searchImage();
    },
    props: {
      data: Object,
    },
    data(){
      return({
        content: null,
        isOpen: false
      });
    },
    methods:{
      searchImage(){
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.data.content, "text/html");
        let returnVal = "https://via.placeholder.com/250x180";

        if(doc.querySelector('img')){
          returnVal = doc.querySelector('img').src;
          // doc.querySelector('img').remove();
        }

        this.content = doc.body.innerHTML;
        return returnVal;
      },
      open(){
        if(!this.isOpen)
          this.isOpen = true;
        else
          this.isOpen = false;
      }
    }
}
</script>
<style scoped>
figure
{
  width: 1024px;
  margin: 0;
  padding: 0;
  margin-top: 30px;
  cursor: pointer;
}
figure img
{
  width: 250px;
  height: 180px;
  border-radius: 10px;
}
figure figcaption #article-content
{
  max-height: 120px;
  overflow: hidden;
  transition: max-height 0.5s;
}
figure figcaption
{
  padding: 0 20px;
}
figure figcaption p
{
  font-weight: 100;
  font-size: 18px;
}
figure figcaption h2
{
  margin-bottom: -5px;
  font-weight: 700;
}
figure figcaption .date-time
{
  font-weight: 100;
  font-size: 13px;
}
figure figcaption .spacer
{
  font-size: 12px;
  font-weight: 100;
  display: inline-block;
  margin: 0 4px;
}
</style>
<style>
#article-content * > img
{
  width: 100%;
  border-radius: 10px;
}
#article-content * > a
{
  color: #5867FC !important;
}
</style>