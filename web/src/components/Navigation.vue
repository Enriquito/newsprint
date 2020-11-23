<template>
    <nav>
        <h3>Readster</h3>
        <ul>
            <li class="d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 18 18">
                    <path id="ic_move_to_inbox_24px" d="M19,3H4.99A1.982,1.982,0,0,0,3.01,5L3,19a1.991,1.991,0,0,0,1.99,2H19a2.006,2.006,0,0,0,2-2V5A2.006,2.006,0,0,0,19,3Zm0,12H15a3,3,0,0,1-6,0H4.99V5H19Zm-3-5H14V7H10v3H8l4,4Z" transform="translate(-3 -3)"/>
                </svg>


                <router-link :to="{name: 'NewArticles'}">New</router-link>
                <small>{{getNotificationCount(unreadArticles)}}</small>
            </li>
            <li class="d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 14 18">
                    <path id="ic_turned_in_not_24px" d="M17,3H7A2,2,0,0,0,5.01,5L5,21l7-3,7,3V5A2.006,2.006,0,0,0,17,3Zm0,15-5-2.18L7,18V5H17Z" transform="translate(-5 -3)"/>
                </svg>

                <router-link to="/">Read Later</router-link>
            </li>
            <li class="d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 20 18.35">
                    <path id="ic_favorite_border_24px" d="M16.5,3A5.988,5.988,0,0,0,12,5.09,5.988,5.988,0,0,0,7.5,3,5.447,5.447,0,0,0,2,8.5c0,3.78,3.4,6.86,8.55,11.54L12,21.35l1.45-1.32C18.6,15.36,22,12.28,22,8.5A5.447,5.447,0,0,0,16.5,3ZM12.1,18.55l-.1.1-.1-.1C7.14,14.24,4,11.39,4,8.5A3.418,3.418,0,0,1,7.5,5a3.909,3.909,0,0,1,3.57,2.36h1.87A3.885,3.885,0,0,1,16.5,5,3.418,3.418,0,0,1,20,8.5C20,11.39,16.86,14.24,12.1,18.55Z" transform="translate(-2 -3)"/>
                </svg>



                <router-link to="/">Saved</router-link>
            </li>
            <li class="d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 21 18">
                    <path id="ic_history_24px" d="M13,3a9,9,0,0,0-9,9H1l3.89,3.89.07.14L9,12H6a7.034,7.034,0,1,1,2.06,4.94L6.64,18.36A9,9,0,1,0,13,3ZM12,8v5l4.28,2.54L17,14.33l-3.5-2.08V8Z" transform="translate(-1 -3)"/>
                </svg>
                <router-link to="/">History</router-link>
            </li>
        </ul>
        <ul class="feeds">
            <li class="d-flex align-items-center" style="cursor:default">
                <span>Feeds</span>
                <svg style="cursor: pointer" @click="openAddFeedPopUp" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                    <path id="ic_add_24px" d="M19,13H13v6H11V13H5V11h6V5h2v6h6Z" transform="translate(-5 -5)"/>
                </svg>
                <AddFeedForm v-if="IsOpenAddFeed" />
            </li>

            <div v-if="data" class="folder-holder">
                <NavigationFolder name="All" :notifications="allFeeds.totalNotifications" :feeds="allFeeds.feeds" />
                <NavigationFolder v-for="folder in data" :key="folder.id" :name="folder.name" :notifications="folder.totalUnread" :feeds="folder.feeds" />
            </div>
        </ul>
    </nav>
</template>
<script>
import NavigationFolder from '@/components/NavigationFolder.vue'
import AddFeedForm from '@/components/AddFeedForm.vue'
import axios from 'axios'

export default {
    name: "Navigation",
    components:{
        NavigationFolder,
        AddFeedForm
    },
    created(){
        this.getData();
        this.getNewArticles();
    },
    data(){
        return({
            IsOpenAddFeed: false,
            data: null,
            unreadArticles: 0
        });
    },
    methods:{
        openAddFeedPopUp(){
            if(this.IsOpenAddFeed){
                this.IsOpenAddFeed = false;
            }
            else{
                this.IsOpenAddFeed = true;
            }
        },
        getData(){
            axios.get(`${process.env.VUE_APP_API}/folders/user/1`)
            .then(response => {
                if(response.status === 200){
                    // this.$store.commit('setFolders', response.data);
                    this.data = response.data;
                }
            })
            .catch(error => {
                alert('Error fetching folders');
                console.log(error);
            })
        },
        getNewArticles(){
            axios.get(`${process.env.VUE_APP_API}/articles/count/unread`)
            .then(response => {
                if(response.status === 200){
                    // this.$store.commit('setFolders', response.data);
                    this.unreadArticles = response.data.unreadArticles;
                }
            })
            .catch(error => {
                alert('Error fetching new articles');
                console.log(error);
            })
        },
        getNotificationCount(num){
            if(num > 999){
                return "999+";
            }
            else if(num == 0)
                return "";
            else
                return num;
        }
    },
    computed:{
        allFeeds(){
            const obj = {
                totalNotifications: 0,
                feeds: []
            };

            if(this.data !== null){
                this.data.forEach(el => {
                    obj.totalNotifications += el.totalUnread;

                    el.feeds.forEach(f => {
                        obj.feeds.push(f);
                    });
                });
            }

            return obj;
        }
    }
}
</script>
<style scoped>
nav
{
    min-height: 100%;
    min-width: 350px;
    margin: 0;
    background: #F6F7F8;
    position: fixed;
    box-shadow: 1px 0px 9px -7px #000;
}
nav ul
{
    margin: 0;
    padding-left: 60px;
}
nav h3
{
    color: #5867FC;
    font-weight: 500;
    font-style: italic;
    font-size: 50px;
    padding: .5em 0;
}
nav ul li
{
    margin-bottom: 10px;
    position: relative;
    list-style-type: none;
    cursor: pointer;
}
nav ul li small
{
    position: absolute;
    right: 10px;
}
nav ul li a
{
    text-decoration: none;
    color: inherit;
    font-weight: 700;
    font-size: 25px;
    padding-left: 30px;
}
nav ul.feeds
{
    padding-top: 30px;
}
nav ul.feeds li:nth-first
{
    list-style-type: none;
}
nav ul.feeds li span
{
    font-size: 25px;
    font-weight: 300;
    font-style: italic;
    padding-right: 10px;
}
.folder-holder
{
    overflow: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.folder-holder::-webkit-scrollbar {
  display: none;
}
</style>