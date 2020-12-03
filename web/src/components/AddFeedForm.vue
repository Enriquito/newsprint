<template>
    <Overlay name="add-feed">
        <h2>Add Feed</h2>
        <div>
            <label>Feed</label>
            <br />
            <input type="text" v-model="url" placeholder="Enter the feed url" />
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

            <div style="margin-top: 10px" class="d-flex justify-content-center">
                <button style="width: 100% !important; background: #5867FC; color: #FFF; border: none;" @click="createFeed">{{buttonText}}</button>
            </div>
        </div>
    </Overlay>
</template>
<script>
import Overlay from '@/components/Overlay.vue';
import axios from 'axios';

export default {
    name: "AddFeedForm",
    components:{
        Overlay
    },
    mounted(){
        this.folders = this.$store.state.folders;
        this.folderId = this.folders[0].id;
    },
    data(){
      return({
          url: null,
          displayName: null,
          folderId: null,
          buttonText: "Save",
          addingNewFolder: false,
          newFolderName: null,
          folders: null
      });
    },
    methods:{
        async createFeed(){
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

            axios.post(`${process.env.VUE_APP_API}/feeds`,{
                feedUrl: this.url,
                folderId: this.folderId
            })
            .then(result => {
                if(result.status === 201){
                    this.$eventHub.$emit('updateNavigation');
                    this.resetInputFields();
                    this.$eventHub.$emit('toggle-overlay');
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
            this.folderId = this.folders[0].id;
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
        async createFolder(){
            return axios.post('/folders',{name: this.newFolderName});
        }
    }
}
</script>