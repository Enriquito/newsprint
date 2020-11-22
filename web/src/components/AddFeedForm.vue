<template>
    <div id="add-feed">
        <div style="height: 100%" class="d-flex">
            <input id="feed-url" type="text" placeholder="Feed url" />
            <button @click="createFeed" >Add</button>
        </div>
    </div>
</template>
<script>
// import moment from 'moment-timezone';
import axios from 'axios';

export default {
    name: "AddFeedForm",
    data(){
      return({

      });
    },
    methods:{
        createFeed(){
            const inpVal = document.getElementById('feed-url').value;

            if(inpVal === ''){
                alert('No url found');
            }

            axios.post(`${process.env.VUE_APP_API}/feeds`,{
                feedUrl: inpVal
            })
            .then(result => {
                if(result.status === 201){
                    console.log('Success!');
                }
            })
            .catch(error => {
                alert('error adding feed');
                console.log(error);
            });
        }
    },
    computed:{

    }
}
</script>
<style scoped>
#add-feed
{
    width: auto;
    height: 35px;
    background: #FFF;
    border-radius: 10px;
    position: absolute;
    bottom: -5px;
    z-index: 999;
    box-shadow: 1px 1px 8px #0000001a;
    display: flex;
    align-items: center;
    border-radius: 10px;
    justify-content: center;
    right: -150px;
}
#add-feed input[type='text']
{
    border-radius: 5px;
    padding: 3px 10px;
    width: 250px;
    outline: none;
    height: 100%;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border: none;
}
#add-feed button
{
    border: none;
    border-radius: 5px;
    padding: 5px 15px;
    background: lightgreen;
    color: white;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    outline: none;
}
</style>