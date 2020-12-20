<template>
  <article v-if="data">
    <h2 @click="open" v-if="!isOpen">{{data.title}}</h2>
    <a v-else :href="data.link" target="_blank"><h2>{{data.title}}</h2></a>

    <div class="d-flex">
      <div style="padding: 10px 0;" class="d-flex align-items-center mobile-block">
        <div v-if="data.feed" class="d-flex align-items-center">
          <img style="width: 20px;" :src="data.feed.iconUrl" />
          <router-link style="margin-left: 5px"  class="feed_link date-time"
          :to="{
            name: 'Feed',
                params:{
                    feedId: data.feed.id,
                    feedName: urlFriendlyTitle(data.feed.displayName),
                    page: 1
                }
          }">{{data.feed.displayName}}</router-link>
        </div>
        <span class="date-time">{{date}}</span>
        <span v-if="data.creator" class="spacer">by</span>
        <strong v-if="data.creator" class="author">{{data.creator}}</strong>
      </div>

      <div class="d-flex justify-content-end align-items-center" style="flex-grow: 1;">
        <svg @click="setArticleToRead" v-if="!data.isRead" class="icon-buttons" xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 22 15">
          <path id="ic_visibility_24px" d="M12,4.5A11.827,11.827,0,0,0,1,12a11.817,11.817,0,0,0,22,0A11.827,11.827,0,0,0,12,4.5ZM12,17a5,5,0,1,1,5-5A5,5,0,0,1,12,17Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,12,9Z" transform="translate(-1 -4.5)"/>
        </svg>
        <svg @click="setToUnread" v-else-if="data.isRead" class="icon-buttons" style="fill: #5867FC !important;" xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 22 15">
          <path id="ic_visibility_24px" d="M12,4.5A11.827,11.827,0,0,0,1,12a11.817,11.817,0,0,0,22,0A11.827,11.827,0,0,0,12,4.5ZM12,17a5,5,0,1,1,5-5A5,5,0,0,1,12,17Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,12,9Z" transform="translate(-1 -4.5)"/>
        </svg>

        <svg @click="saveToFavorites" v-if="!data.favorite" class="icon-buttons" xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 20 18.35">
          <path id="ic_favorite_border_24px" d="M16.5,3A5.988,5.988,0,0,0,12,5.09,5.988,5.988,0,0,0,7.5,3,5.447,5.447,0,0,0,2,8.5c0,3.78,3.4,6.86,8.55,11.54L12,21.35l1.45-1.32C18.6,15.36,22,12.28,22,8.5A5.447,5.447,0,0,0,16.5,3ZM12.1,18.55l-.1.1-.1-.1C7.14,14.24,4,11.39,4,8.5A3.418,3.418,0,0,1,7.5,5a3.909,3.909,0,0,1,3.57,2.36h1.87A3.885,3.885,0,0,1,16.5,5,3.418,3.418,0,0,1,20,8.5C20,11.39,16.86,14.24,12.1,18.55Z" transform="translate(-2 -3)"/>
        </svg>
        <svg @click="RemoveFromFavorites" v-else class="icon-buttons" style="fill: #5867FC !important;" xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 20 18.35">
          <path id="ic_favorite_border_24px" d="M16.5,3A5.988,5.988,0,0,0,12,5.09,5.988,5.988,0,0,0,7.5,3,5.447,5.447,0,0,0,2,8.5c0,3.78,3.4,6.86,8.55,11.54L12,21.35l1.45-1.32C18.6,15.36,22,12.28,22,8.5A5.447,5.447,0,0,0,16.5,3ZM12.1,18.55l-.1.1-.1-.1C7.14,14.24,4,11.39,4,8.5A3.418,3.418,0,0,1,7.5,5a3.909,3.909,0,0,1,3.57,2.36h1.87A3.885,3.885,0,0,1,16.5,5,3.418,3.418,0,0,1,20,8.5C20,11.39,16.86,14.24,12.1,18.55Z" transform="translate(-2 -3)"/>
        </svg>
      </div>
    </div>

    <div @click="open" v-if="isOpen" style="max-height:10000px; cursor: pointer;" id="article-content" v-html="content"></div>
    <div @click="open" v-else id="article-content" style="cursor: pointer;" v-html="content"></div>
  </article>
  <ArticleSkeleton v-else />
</template>
<script>
import moment from 'moment-timezone';
import axios from 'axios';
import ArticleSkeleton from '@/components/ArticleSkeleton.vue';

export default {
    name: "Article",
    mounted(){
      this.editLinkAttributes();
    },
    components:{
      ArticleSkeleton
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
            this.setArticleToRead();
          }
        }
        else{
          this.isOpen = false;
        }
      },
      editLinkAttributes(){
        if(this.data.content !== null){
          const parser = new DOMParser();
          const doc = parser.parseFromString(this.data.content, "text/html");

          doc.querySelectorAll('a').forEach(a => {
            a.setAttribute('target', '_blank');
          });

          this.content = doc.body.innerHTML;
        }
        else{
          this.content = "No content."
        }
      },
      urlFriendlyTitle(name){
        if(name === null){
          console.log(this.data);
          return;
        }

        let res = name;
        res = res.replaceAll('-', '');
        return res.replaceAll(' ', '');
      },
      setArticleToRead(){
        this.data.isRead = true;
        this.AddToHistory();
        axios.put(`${process.env.VUE_APP_API}/articles/set/read`,{id: this.data.id})
          .then(response => {
            if(response.status === 200){
              this.$eventHub.$emit('updateNavigation');
            }
          })
          .catch(error => {
            this.data.isRead = false;
            console.log(error);
          });
      },
      setToUnread(){
        this.data.isRead = false;
        axios.put(`${process.env.VUE_APP_API}/articles/set/unread`,{id: this.data.id})
          .then(response => {
            if(response.status === 200){
              this.$eventHub.$emit('updateNavigation');
            }
          })
          .catch(error => {
            this.data.isRead = true;
            console.log(error);
          });
      },
      saveToFavorites(){
        this.data.favorite = true;

        axios.post(`${process.env.VUE_APP_API}/articles/save/favorite`,{id: this.data.id})
        .catch(error => {
          this.data.favorites = false;
          console.log(error);
        })
      },
      RemoveFromFavorites(){
        this.data.favorite = false;
        axios.post(`${process.env.VUE_APP_API}/articles/remove/favorite`,{id: this.data.id})
        .catch(error => {
          this.data.favorites = true;
          console.log(error);
        })
      },
      AddToHistory(){
        axios.post(`${process.env.VUE_APP_API}/history`, {article: this.data.id})
        .catch(error => {
          console.error(error);
        });
      }

    },
    computed:{
      date(){
        if(moment(this.data.isoDate).format('D-MM-YYYY') === moment().format('D-MM-YYYY'))
          return `Today ${moment(this.data.isoDate).format('HH:MM')}`
        else
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
  fill: #707070;
}
.icon-buttons:hover
{
  fill: #5867FC;
}
article
{
  width: 1024px;
  margin: 0;
  margin-top: 30px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 1px 3px 7px rgba(0, 0, 0, 0.1);
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
  cursor: pointer;
}
article .date-time
{
  font-weight: 100;
  font-size: 13px;
  margin-left: 5px;
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
.feed_link
{
  color: inherit;
}
.feed_link:hover
{
  color: inherit;
}
@media (max-width: 1500px) {
    article
    {
        width: auto !important;
    }
    .date-time
    {
      max-width: 120px !important;
    }
    .mobile-block a, .date-time
    {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 80px;
    }
    article h2
    {
      font-size: 20px !important;
    }
}
</style>