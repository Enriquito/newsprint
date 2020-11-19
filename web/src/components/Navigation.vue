<template>
    <nav>
        <h3>Readster</h3>
        <ul>
            <li class="d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 19.94 19.5">
                    <path id="ic_notifications_active_24px" d="M7.58,4.08,6.15,2.65A10.425,10.425,0,0,0,2.03,10.5h2A8.446,8.446,0,0,1,7.58,4.08ZM19.97,10.5h2a10.489,10.489,0,0,0-4.12-7.85L16.43,4.08A8.5,8.5,0,0,1,19.97,10.5ZM18,11c0-3.07-1.64-5.64-4.5-6.32V4a1.5,1.5,0,0,0-3,0v.68C7.63,5.36,6,7.92,6,11v5L4,18v1H20V18l-2-2ZM12,22a1.752,1.752,0,0,0,.4-.04,2.029,2.029,0,0,0,1.44-1.18,2.008,2.008,0,0,0,.15-.78h-4A2.014,2.014,0,0,0,12,22Z" transform="translate(-2.03 -2.5)"/>
                </svg>

                <router-link to="/">New</router-link>
                <small>10</small>
            </li>
            <li class="d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 14 18">
                    <path id="ic_turned_in_not_24px" d="M17,3H7A2,2,0,0,0,5.01,5L5,21l7-3,7,3V5A2.006,2.006,0,0,0,17,3Zm0,15-5-2.18L7,18V5H17Z" transform="translate(-5 -3)"/>
                </svg>

                <router-link to="/">Read Later</router-link>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                    <path id="ic_add_24px" d="M19,13H13v6H11V13H5V11h6V5h2v6h6Z" transform="translate(-5 -5)"/>
                </svg>
            </li>

            <div class="folder-holder">
                <NavigationFolder name="All" :notifications="allFeeds.totalNotifications" :feeds="allFeeds.feeds" />
                <NavigationFolder v-for="folder in d" :key="folder.id" :name="folder.name" :notifications="folder.totalNotifications" :feeds="folder.feeds" />
            </div>
        </ul>
    </nav>
</template>
<script>
import axios from 'axios'
import NavigationFolder from '@/components/NavigationFolder.vue'

export default {
    name: "Navigation",
    components:{
        NavigationFolder
    },
    mounted(){
        this.getData();
    },
    data(){
        return({
            data: [
                    {
                        id: 1,
                        name:"Programming",
                        totalNotifications: 5,
                        feeds: [
                                    {id: 1, name: 'Vue', notifications: 0},
                                    {id: 2, name: 'NodeJS', notifications: 5},
                                    {id: 3, name: 'React', notifications: 0}
                                ]
                    },
                    {
                        id: 1,
                        name:"News",
                        totalNotifications: 10,
                        feeds: [
                                    {id: 1, name: 'NOS', notifications: 10}
                                ]
                    },
                    {
                        id: 1,
                        name:"Movies",
                        totalNotifications: 0,
                        feeds: [
                                    {id: 1, name: 'IBMD', notifications: 0}
                                ]
                    }
                ],
            d: null
        });
    },
    methods:{
        getData(){
            axios.get(`${process.env.VUE_APP_API}/folders/user/1`)
            .then(response => {
                if(response.status === 200){
                    this.d = response.data;
                }
            })
        }
    },
    computed:{
        allFeeds(){
            const obj = {
                totalNotifications: 0,
                feeds: []
            };

            if(this.d !== null){
                this.d.forEach(el => {
                    obj.totalUnread+= el.totalNotifications;
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