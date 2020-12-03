<template>
    <li
        @mouseenter="() => {this.showEditIcon = true}"
        @mouseleave="() => {this.showEditIcon = false}"
        draggable @dragstart="startDrag($event, feed, feed.folderId)"
        class="d-flex align-items-center"
    >
        <div class="d-flex align-content-center" style="padding-left: 20px">
            <img :src="feed.iconUrl" />
            <router-link :to="{
                name: 'Feed',
                params:{
                    feedId: feed.id,
                    feedName: urlFriendlyTitle(feed.title),
                    page: 1
                }
            }">{{feedName(feed)}}</router-link>
            <div class="d-flex align-items-center justify-content-end">
                <small class="side-content" v-if="!showEditIcon">{{getNotificationCount(feed.unreadArticles)}}</small>

                <svg @click="openOverlay" class="side-content" v-else version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18" viewBox="0 0 64 64">
                    <path d="M24 40l8-4 28-28-4-4-28 28-4 8zM18.081 54.194c-1.977-4.17-4.104-6.298-8.275-8.275l6.193-17.049 8-4.869 24-24h-12l-24 24-12 40 40-12 24-24v-12l-24 24-4.87 8z" fill="#000000"></path>
                </svg>
            </div>
            <EditFeedForm :feed="feed" />
        </div>
    </li>
</template>
<script>
import EditFeedForm from '@/components/EditFeedForm.vue';

export default {
    name: "NavigationFolderFeed",
    props:{
        feed: Object
    },
    components:{
        EditFeedForm
    },
    data(){
        return({
            showEditIcon: false
        });
    },
    methods:{
        openOverlay(){
            this.showEditIcon = false;
            this.$eventHub.$emit(`toggle-overlay-edit-feed-${this.feed.id}`);
        },
        startDrag(event, feed, currentFolderId){
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('feed', JSON.stringify({feed: feed, currentFolderId: currentFolderId}))
        },
        feedName(feed){
            if(feed.displayName !== null)
                return feed.displayName;
            else
                return feed.title;
        },
        urlFriendlyTitle(name){
            let res = name;
            res = res.replaceAll('-', '');
            return res.replaceAll(' ', '');
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
    }
}
</script>
<style scoped>
    .router-link-active, .router-link-exact-active
    {
        color: #5867FC !important;
    }
    nav ul li
    {
        margin-bottom: 10px;
        position: relative;
        list-style-type: none;
        cursor: pointer;
    }
    nav ul li .side-content
    {
        position: absolute;
        right: 10px;
        top: 7px;
    }
    nav ul li div strong
    {
        font-size: 25px;
        padding-left: 30px;
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
</style>