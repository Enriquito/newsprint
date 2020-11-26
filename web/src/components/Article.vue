<template>
  <article>
    <h2 v-if="!isOpen">{{data.title}}</h2>
    <a v-else :href="data.link" target="_blank"><h2>{{data.title}}</h2></a>

    <div class="d-flex">
      <div>
        <span class="date-time">{{date}}</span>
        <span v-if="data.creator" class="spacer">by</span>
        <strong v-if="data.creator" class="author">{{data.creator}}</strong>
      </div>

      <div class="d-flex justify-content-end" style="flex-grow: 1;">
        <svg @click="setArticleToRead" v-if="!data.isRead" class="icon-buttons" xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 22 15">
          <path id="ic_visibility_24px" d="M12,4.5A11.827,11.827,0,0,0,1,12a11.817,11.817,0,0,0,22,0A11.827,11.827,0,0,0,12,4.5ZM12,17a5,5,0,1,1,5-5A5,5,0,0,1,12,17Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,12,9Z" transform="translate(-1 -4.5)"/>
        </svg>
        <svg @click="setToUnread" v-else-if="data.isRead" class="icon-buttons" style="fill: #FC7C7C !important;" xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 22 15">
          <path id="ic_visibility_24px" d="M12,4.5A11.827,11.827,0,0,0,1,12a11.817,11.817,0,0,0,22,0A11.827,11.827,0,0,0,12,4.5ZM12,17a5,5,0,1,1,5-5A5,5,0,0,1,12,17Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,12,9Z" transform="translate(-1 -4.5)"/>
        </svg>

        <svg class="icon-buttons" xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 20 18.35">
          <path id="ic_favorite_border_24px" d="M16.5,3A5.988,5.988,0,0,0,12,5.09,5.988,5.988,0,0,0,7.5,3,5.447,5.447,0,0,0,2,8.5c0,3.78,3.4,6.86,8.55,11.54L12,21.35l1.45-1.32C18.6,15.36,22,12.28,22,8.5A5.447,5.447,0,0,0,16.5,3ZM12.1,18.55l-.1.1-.1-.1C7.14,14.24,4,11.39,4,8.5A3.418,3.418,0,0,1,7.5,5a3.909,3.909,0,0,1,3.57,2.36h1.87A3.885,3.885,0,0,1,16.5,5,3.418,3.418,0,0,1,20,8.5C20,11.39,16.86,14.24,12.1,18.55Z" transform="translate(-2 -3)"/>
        </svg>

        <svg class="icon-buttons" xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 14 18">
          <path id="ic_turned_in_not_24px" d="M17,3H7A2,2,0,0,0,5.01,5L5,21l7-3,7,3V5A2.006,2.006,0,0,0,17,3Zm0,15-5-2.18L7,18V5H17Z" transform="translate(-5 -3)"/>
        </svg>
      </div>
    </div>

    <div @click="open" v-if="isOpen" style="max-height:1500px; cursor: pointer;" id="article-content" v-html="content"></div>
    <div @click="open" v-else id="article-content" style="cursor: pointer;" v-html="content"></div>
  </article>
</template>
<script>
import moment from 'moment-timezone';
import axios from 'axios';

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
        isOpen: false,
        AddFeedIsOpen: false,
        setToRead: null,
        hasBeenSetToRead: false
      });
    },
    methods:{
      open(){
        if(!this.isOpen){
          this.isOpen = true;
          if(!this.data.isRead){
            this.setToRead = setTimeout(() => {
              this.setArticleToRead();
            }, 6000);
          }
        }
        else{
          this.isOpen = false;
          clearTimeout(this.setToRead);
        }
      },
      editLinkAttributes(){
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.data.content, "text/html");

        doc.querySelectorAll('a').forEach(a => {
          a.setAttribute('target', '_blank');
        });

        this.content = doc.body.innerHTML;
      },
      setArticleToRead(){
        axios.put(`${process.env.VUE_APP_API}/articles/set/read`,{id: this.data.id})
          .then(response => {
            if(response.status === 200){
              // this.hasBeenSetToRead = true;
              this.data.isRead = true;
            }
          });
      },
      setToUnread(){
        axios.put(`${process.env.VUE_APP_API}/articles/set/unread`,{id: this.data.id})
          .then(response => {
            if(response.status === 200){
              this.data.isRead = false;
              this.changeUnreadNavigationNumber();
            }
          });
      },
      changeUnreadNavigationNumber(){
        // this.$store.commit('setFolders', response.data);
        const folderData = this.$store.state.folders;
        console.log(folderData);
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
.icon-buttons
{
  margin-right: 5px;
  cursor: pointer;
  transition: fill 0.2s;
}
.icon-buttons:hover
{
  fill: #FC7C7C;
}
article
{
  width: 1024px;
  margin: 0;
  padding: 0;
  margin-top: 30px;
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
  margin-bottom: 0px;
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