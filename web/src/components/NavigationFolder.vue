<template>
    <li>
        <div class="d-flex align-items-center">
            <svg @click="open" v-if="!isOpen" class="close" xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 7.41 12">
                <path id="ic_chevron_right_24px" d="M10,6,8.59,7.41,13.17,12,8.59,16.59,10,18l6-6Z" transform="translate(-8.59 -6)"/>
            </svg>
            <svg @click="open" v-else class="open" xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 7.41 12">
                <path id="ic_chevron_right_24px" d="M10,6,8.59,7.41,13.17,12,8.59,16.59,10,18l6-6Z" transform="translate(-8.59 -6)"/>
            </svg>

            <router-link :to="{name:'FolderView', params:{folder: name}}">{{name}}</router-link>
            <small>{{getNotificationCount(totalNotifications)}}</small>
        </div>


        <ul v-if="feeds && isOpen">
            <li v-for="feed in feeds" :key="feed.id" class="d-flex align-items-center">
                <div class="d-flex align-content-center" style="padding-left: 20px">
                    <img :src="feed.iconUrl" />
                    <router-link :to="{name: 'Feed', params:{feedId: feed.id, feedName: urlFriendlyTitle(feed.title)}}">{{feed.title}}</router-link>
                    <small>{{getNotificationCount(feed.unreadArticles)}}</small>
                </div>
            </li>
        </ul>
    </li>
</template>
<script>
export default {
    name: "NavigationFolder",
    props:{
        name: String,
        feeds: Array
    },
    data(){
        return({
            isOpen: false
        });
    },
    methods:{
        open(){
            if(!this.isOpen)
                this.isOpen = true;
            else
                this.isOpen = false;
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
        urlFriendlyTitle(name){
            let res = name;
            res = res.replaceAll('-', '');
            return res.replaceAll(' ', '');
        },
        setCurrentFeed(feed){
            console.log('a');
            this.$store.commit('setCurrentFeed', feed);
        }
    },
    computed:{
        totalNotifications(){
            let tmp = 0;

            this.feeds.forEach(feed => {
                tmp += feed.unreadArticles;
            });

            return tmp;
        }
    }
}
</script>
<style scoped>
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
        top: 7px;
    }
    nav ul li a
    {
        text-decoration: none;
        color: inherit;
        font-weight: 700;
        font-size: 25px;
        padding-left: 30px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 190px;
        display: inline-block;
    }
    nav ul li ul li a
    {
        font-size: 15px;
        padding: 5px !important;
    }
    nav ul li ul li img
    {
        width: 20px;
        height: 20px;
        margin-top: 7px;
    }
    .open
    {
        animation: openAnimation 0.15s forwards;
    }
    .close
    {
        animation: closeAnimation 0.15s forwards;
    }

    @keyframes openAnimation {
        0%{
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(90deg);
        }
    }
    @keyframes closeAnimation {
        0%{
            transform: rotate(90deg);
        }
        100%{
            transform: rotate(0deg);
        }
    }
</style>