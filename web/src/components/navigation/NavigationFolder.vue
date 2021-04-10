<template>
    <li @dragover.prevent @dragenter.prevent @drop="onDrop($event, id)">
        <div @click="open" class="d-flex align-items-center">
            <svg v-if="!isOpen" class="close icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.41 12">
                <path id="ic_chevron_right_24px" d="M10,6,8.59,7.41,13.17,12,8.59,16.59,10,18l6-6Z" transform="translate(-8.59 -6)"/>
            </svg>
            <svg v-else class="open icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.41 12">
                <path id="ic_chevron_right_24px" d="M10,6,8.59,7.41,13.17,12,8.59,16.59,10,18l6-6Z" transform="translate(-8.59 -6)"/>
            </svg>

            <strong>{{name}}</strong>
            <small>{{getNotificationCount(totalNotifications)}}</small>
        </div>

         <ul v-if="feeds && isOpen">
             <div  v-for="feed in feeds" :key="feed.id">
                <NavigationFolderFeed :feed="feed"  />
                <EditFeedForm :feed="feed" />
             </div>
        </ul>
    </li>
</template>
<script>
import NavigationFolderFeed from '@/components/navigation/NavigationFolderFeed.vue';
import EditFeedForm from '@/components/EditFeedForm.vue';

export default {
    name: "NavigationFolder",
    components:{
        NavigationFolderFeed,
        EditFeedForm
    },
    props:{
        name: String,
        feeds: Array,
        id : Number
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
        feedName(feed){
            console.log(feed);
            if(feed.displayName !== null){
                console.log('oi');
                return feed.displayName;
            }
            else{
                console.log(true);
                return feed.title;
            }

        },
        startDrag(event, feed, currentFolderId){
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('feed', JSON.stringify({feed: feed, currentFolderId: currentFolderId}))
        },
        onDrop(event, folderId){
            const obj = JSON.parse(event.dataTransfer.getData('feed'));
            this.$emit('move', {folderId: folderId, feed: obj.feed, currentFolderId: obj.currentFolderId});
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
nav ul li small
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
@media (max-width: 350px) {
    nav ul{
        padding: 20px;
    }
    nav ul li small
    {
        right: 20px !important;
    }
}
@media (max-width: 720px) {
    nav ul li div strong
    {
        font-size: 15px;
    }
}
</style>