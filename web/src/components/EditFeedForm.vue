<template>
    <Overlay :name="`edit-feed-${feed.id}`">
        <h2>Edit Feed</h2>
        <div>
            <label>Name</label>
            <br />
            <input type="text" disabled v-model="feed.title" placeholder="Enter the feed url" />
        </div>
        <div>
            <label>Display Name</label>
            <br />
            <input type="text" v-model="feed.displayName" placeholder="Enter a new display name for this feed" />
        </div>
        <div>
            <label>Icon adres</label>
            <br />
            <input type="text" v-model="feed.iconUrl" placeholder="Enter a custom display name" />
        </div>
        <div>
            <label>Feed adres</label>
            <br />
            <input type="text" v-model="feed.feedUrl" placeholder="Enter a custom display name" />
        </div>
        <div>
            <label>Folder</label>
            <br />
            <div class="d-flex align-items-center">
                <select v-if="!addingNewFolder" v-model="folderId">
                    <option v-for="folder in folders" :key="folder.id" :value="folder.id">{{folder.name}}</option>
                </select>
                <input v-else style="height: 33px;" type="text" max="15" v-model="newFolderName" placeholder="Enter a name for your new folder"/>

                <svg v-if="!addingNewFolder" @click="toggleNewFolderfield" style="cursor: pointer; margin-left: 10px" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                    <path id="ic_add_24px" d="M19,13H13v6H11V13H5V11h6V5h2v6h6Z" transform="translate(-5 -5)"/>
                </svg>
                <div v-else class="d-flex align-items-center">
                    <svg @click="toggleNewFolderfield" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 7.41 12">
                        <path id="ic_chevron_right_24px" d="M10,6,8.59,7.41,13.17,12,8.59,16.59,10,18l6-6Z" transform="translate(-8.59 -6)"/>
                    </svg>
                </div>
            </div>

            <div style="margin-top: 10px">
                <button style="width: 100% !important; background: #5867FC; color: #FFF; border: none;" @click="editFeed">{{buttonText}}</button>
                <button style="width: 100% !important; margin-top: 5px; background: tomato; color: #FFF; border: none;" @click="deleteFeed">{{deleteText}}</button>
            </div>
        </div>
    </Overlay>
</template>
<script>
import Overlay from '@/components/Overlay.vue';
import axios from 'axios';

export default {
    name: "EditFeedForm",
    components:{
        Overlay
    },
    mounted(){
        this.folders = this.$store.state.folders;
        this.folderId = this.feed.folderId;
    },
    updated(){

    },
    data(){
      return({
          buttonText: "Save",
          deleteText: "Delete",
          folders: null,
          addingNewFolder: false,
          folderId: null,
          newFolderName: null
      });
    },
    props:{
        feed: Object
    },
    methods:{
        async editFeed(){
            this.buttonText = "Saving..."

            if(this.newFolderName !== null){
                try{
                    const response = await this.createFolder();

                    if(response.status === 201){
                        this.folderId = response.data.id;

                        if(this.url === '' || this.url === null ){
                            this.$eventHub.$emit('updateNavigation');
                            this.resetInputFields();
                            this.$eventHub.$emit('toggle-overlay');
                            return;
                        }
                    }
                }
                catch(error){
                    console.log(error);
                    alert('error creating folder');
                    this.resetInputFields();
                }
            }

            axios.put(`${process.env.VUE_APP_API}/feeds`,{
                feed: {
                    id: this.feed.id,
                    feedUrl: this.feed.url,
                    iconUrl: this.feed.iconUrl,
                    displayName: this.feed.displayName,
                    folderId: this.folderId
                }
            })
            .then(result => {
                if(result.status === 200){
                    this.$eventHub.$emit('updateNavigation');
                    this.resetInputFields();
                    this.$eventHub.$emit(`toggle-overlay-edit-feed-${this.feed.id}`);
                }
            })
            .catch(error => {
                alert('error adding feed');
                this.resetInputFields();
                console.log(error);
            });
        },
        resetInputFields(){
            this.buttonText = "Save";
            this.url = null;
            this.displayName = null;
            this.addingNewFolder = false;
            this.newFolderName = null;
        },
        toggleNewFolderfield(event){
            event.preventDefault();

            if(this.addingNewFolder)
                this.addingNewFolder = false;
            else
                this.addingNewFolder = true;
        },
        deleteFeed(){
            if(!confirm(`Are you sure you want to delete the feed '${this.feed.title}'?`))
                return;

            axios.delete(`/feeds/${this.feed.id}`)
            .then(response => {
                if(response.status === 200){
                    this.$eventHub.$emit('updateNavigation');
                    this.resetInputFields();
                    this.$eventHub.$emit(`toggle-overlay-edit-feed-${this.feed.id}`);
                }
            })
            .catch(error => {
                alert('error deleting feed');
                this.resetInputFields();
                console.log(error);
            });
        },
        async createFolder(){
            return axios.post('/folders',{name: this.newFolderName});
        },
    }
}
</script>