<template>
    <nav>
        <h3>Newsprint</h3>
        <ul>
            <li class="d-flex align-items-center">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                    <path d="M19,3H4.99A1.982,1.982,0,0,0,3.01,5L3,19a1.991,1.991,0,0,0,1.99,2H19a2.006,2.006,0,0,0,2-2V5A2.006,2.006,0,0,0,19,3Zm0,12H15a3,3,0,0,1-6,0H4.99V5H19Zm-3-5H14V7H10v3H8l4,4Z" transform="translate(-3 -3)"/>
                </svg>

                <router-link :to="{name: 'NewArticles', params: {page: 1}}">New</router-link>
                <small>{{getNotificationCount(unreadArticles)}}</small>
            </li>

            <li class="d-flex align-items-center">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 18.35">
                    <path d="M16.5,3A5.988,5.988,0,0,0,12,5.09,5.988,5.988,0,0,0,7.5,3,5.447,5.447,0,0,0,2,8.5c0,3.78,3.4,6.86,8.55,11.54L12,21.35l1.45-1.32C18.6,15.36,22,12.28,22,8.5A5.447,5.447,0,0,0,16.5,3ZM12.1,18.55l-.1.1-.1-.1C7.14,14.24,4,11.39,4,8.5A3.418,3.418,0,0,1,7.5,5a3.909,3.909,0,0,1,3.57,2.36h1.87A3.885,3.885,0,0,1,16.5,5,3.418,3.418,0,0,1,20,8.5C20,11.39,16.86,14.24,12.1,18.55Z" transform="translate(-2 -3)"/>
                </svg>

                <router-link :to="{name:'Favorites'}">Favorites</router-link>
            </li>

            <li class="d-flex align-items-center">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 18">
                    <path d="M13,3a9,9,0,0,0-9,9H1l3.89,3.89.07.14L9,12H6a7.034,7.034,0,1,1,2.06,4.94L6.64,18.36A9,9,0,1,0,13,3ZM12,8v5l4.28,2.54L17,14.33l-3.5-2.08V8Z" transform="translate(-1 -3)"/>
                </svg>
                <router-link :to="{name: 'History'}">History</router-link>
            </li>

            <li class="d-flex align-items-center">
                <svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64">
                    <path d="M58.362 38.141c-3.358-5.816-1.339-13.269 4.51-16.655l-6.289-10.893c-1.797 1.053-3.886 1.657-6.115 1.657-6.721 0-12.169-5.484-12.169-12.249h-12.579c0.017 2.088-0.505 4.205-1.622 6.141-3.358 5.816-10.822 7.794-16.679 4.422l-6.289 10.893c1.811 1.029 3.378 2.537 4.493 4.467 3.352 5.807 1.345 13.245-4.482 16.639l6.289 10.893c1.791-1.044 3.87-1.641 6.088-1.641 6.7 0 12.134 5.45 12.169 12.185h12.578c-0.005-2.067 0.517-4.161 1.623-6.076 3.352-5.807 10.798-7.787 16.651-4.438l6.289-10.893c-1.799-1.029-3.356-2.531-4.465-4.452zM32 44.958c-7.157 0-12.959-5.801-12.959-12.958s5.802-12.958 12.959-12.958c7.157 0 12.958 5.802 12.958 12.958s-5.801 12.958-12.958 12.958z" fill="#000000"></path>
                </svg>
                <router-link :to="{name: 'Preferences'}">Preferences</router-link>
            </li>

            <li class="d-flex align-items-center">
                <svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64">
                    <path d="M48 40v-8h-20v-8h20v-8l12 12zM44 36v16h-20v12l-24-12v-52h44v20h-4v-16h-32l16 8v36h16v-12z" fill="#000000"></path>
                </svg>
                <strong @click="logout">Logout</strong>
            </li>
        </ul>
        <div>
            <div style="" class="d-flex align-items-center feed-spacer">
                <span>Feeds</span>
                <svg v-if="data" style="cursor: pointer" @click="openAddFeedPopUp" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                    <path d="M19,13H13v6H11V13H5V11h6V5h2v6h6Z" transform="translate(-5 -5)"/>
                </svg>
                <div class="d-flex align-items-center" style="cursor:default">
                    <AddFeedForm v-if="data" :folders="data" />
                </div>
            </div>
            <ul class="feeds folder-holder">
                <div style="padding-bottom: 20px;" v-if="data">
                    <!-- <NavigationFolder name="All" :notifications="allFeeds.totalNotifications" :feeds="allFeeds.feeds" /> -->
                    <NavigationFolder @move="moveFeedToFolder" v-for="folder in data" :key="folder.id" :name="folder.name" :id="folder.id" :notifications="folder.totalUnread" :feeds="folder.feeds" />
                </div>
            </ul>
        </div>
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
    mounted(){
        this.$eventHub.$on('updateNavigation', () => {
            setTimeout(() =>{
                this.data = this.$store.state.folders;
            }, 1000)
        });

        let a = null;
        if(this.$store.state.folders === undefined || this.$store.state.unreadArticles === undefined){
            a = setInterval(() => {
                if(this.$store.state.folders !== undefined && this.$store.state.unreadArticles !== undefined){
                    this.data = this.$store.state.folders;
                    this.unreadArticles = this.$store.state.unreadArticles;
                    clearInterval(a);
                }
            }, 100);
        }
        else{
            this.data = this.$store.state.folders;
            this.unreadArticles = this.$store.state.unreadArticles;
        }
    },
    data(){
        return({
            data: null,
            unreadArticles: 0
        });
    },
    methods:{
        logout(){
            axios.get(`${process.env.VUE_APP_API}/logout`,{
                withCredentials: true,
                credentials: 'include'
            })
            .then(response => {
                if(response.status === 200){
                    this.$store.commit('setFolders', null);
                    this.$store.commit('setUnreadArticles', null);
                    this.$router.push({name: 'Login'});
                }
            })
        },
        openAddFeedPopUp(){
            this.$eventHub.$emit('toggle-overlay-add-feed');
        },
        getNotificationCount(num){
            if(num > 999){
                return "999+";
            }
            else if(num == 0)
                return "";
            else
                return num;
        },
        moveFeedToFolder(obj){
            if(obj.currentFolderId === obj.folderId)
                return;

            this.data.forEach(folder => {
                if(folder.id === obj.folderId){
                    folder.feeds.push(obj.feed);
                    this.data.forEach(folder => {
                        if(folder.id === obj.currentFolderId){
                            folder.feeds.forEach((feed, index) => {
                                if(feed.id === obj.feed.id){
                                    folder.feeds.splice(index, 1);
                                    this.changeFolderRequest(obj.currentFolderId, obj.folderId, obj.feed.id)
                                    return;
                                }
                            })
                        }
                    })
                }
            })
        },
        changeFolderRequest(from, to, feedId){
            axios.post(`${process.env.VUE_APP_API}/move/feeds`, {
                from: from,
                to: to,
                feedId: feedId
            },{
                withCredentials: true,
                credentials: 'include'
            })
            .catch(error => {
                alert('Error moving feed to folder');
                console.error(error);
            })
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
    box-shadow: 1px 0px 9px -7px #000;
    height: 100%;
    overflow-y: scroll;
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
nav ul li a, nav ul li strong
{
    text-decoration: none;
    color: inherit;
    font-weight: 700;
    font-size: 25px;
    padding-left: 30px;
}
.router-link-active, .router-link-exact-active
{
    color: #5867FC !important;
}
nav ul.feeds li:nth-first
{
    list-style-type: none;
}
nav div span
{
    font-size: 25px;
    font-weight: 300;
    font-style: italic;
    padding-right: 10px;
}
.folder-holder
{
    -ms-overflow-style: none;
    scrollbar-width: none;
    max-height: 600px !important;
}
.feed-spacer
{
    padding-left: 60px;
    padding-top: 20px;
}
.folder-holder::-webkit-scrollbar 
{
  display: none;
}
nav::-webkit-scrollbar
{
  display: none;
}
@media (max-width: 720px) {
    nav{
        /* display: none; */
        width: 250px !important;
        min-width: auto;
        position: fixed;
        transition: all 0.3s;
        left: -350px;
        box-shadow: 10px 0px 20px 0px #0000002b !important;
    }
    nav h3
    {
        font-size: 30px;
    }
    nav ul{
        padding-left: 20px !important;
    }
    nav ul li a, nav ul li strong
    {
        font-size: 15px !important;
    }
    nav div span
    {
        font-size: 15px;
    }
}
@media (max-width: 350px) {
    nav ul{
        padding: 20px;
    }
    nav ul li small
    {
        right: 20px !important;
    }
    .feed-spacer
    {
        padding-left: 20px !important;
    }
}
</style>
<style>
nav .icon
{
    width: 21px;
    height: 18px;
}
@media (max-width: 720px)
{
    nav .icon
    {
        width: 15px;
        height: 15px;
    }
}
</style>