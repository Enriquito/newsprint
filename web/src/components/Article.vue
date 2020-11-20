<template>
  <article @click="open">
    <h2 v-if="!isOpen">{{data.title}}</h2>
    <a v-else :href="data.link" target="_blank"><h2>{{data.title}}</h2></a>

    <span class="date-time">{{date}}</span>
    <span v-if="data.creator" class="spacer">by</span>
    <strong v-if="data.creator" class="author">{{data.creator}}</strong>

    <div v-if="isOpen" style="max-height:1500px;" id="article-content" v-html="content"></div>
    <div v-else id="article-content" v-html="content"></div>
  </article>
</template>
<script>
import moment from 'moment-timezone';

export default {
    name: "Article",
    mounted(){
      // this.searchImage();
      this.editLinkAttributes();
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
      },
      editLinkAttributes(){
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.data.content, "text/html");

        doc.querySelectorAll('a').forEach(a => {
          a.setAttribute('target', '_blank');
        });

        this.content = doc.body.innerHTML;
      }
    },
    computed:{
      date(){
        return moment(this.data.isoDate).format('LL')
      }
    }
}
</script>
<style scoped>
article
{
  width: 1024px;
  margin: 0;
  padding: 0;
  margin-top: 30px;
  cursor: pointer;
}
article a h2
{
  color: #707070 !important;
  text-decoration: underline;
}
article #article-content
{
  max-height: 120px;
  overflow: hidden;
  transition: max-height 0.5s;
}
article p
{
  font-weight: 100;
  font-size: 18px;
}
article h2
{
  margin-bottom: -5px;
  font-weight: 700;
}
article .date-time
{
  font-weight: 100;
  font-size: 13px;
}
article .spacer
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
  margin: 15px 0;
}
#article-content * > a
{
  color: #5867FC !important;
}
</style>