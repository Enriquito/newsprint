<template>
<DefaultTemplate>
  <section v-if="data">
        <h1>Preferences</h1>
        <div>
          <label>Folders</label>
          <br />
          <small>Manage your folders here</small>
          <ul>
            <li>
              <div class="d-flex">
                <div style="border-right: none;" class="folder-order">
                  <span>Order</span>
                </div>
                <div style="border-right: none;" class="folder-name">
                  <span>Name</span>
                </div>
                <div style="border-right: none;" class="folder-feeds-count">
                  <span>Feeds</span>
                </div>
                <div class="folder-actions">
                  <span></span>
                </div>
              </div>
            </li>
            <li v-for="folder in folders" :key="folder.id">
              <div class="d-flex">
                <div class="folder-order">
                  <select @change="changeOrder($event, folder)" :data-original-val="folder.showOrder" v-if="folder.name != 'No folder'" v-model="folder.showOrder">
                    <option v-for="order in (folders.length - 1)" :key="order" :value="order">{{order}}</option>
                  </select>
                  <select v-else v-model="folder.showOrder" disabled>
                    <option value="0">0</option>
                  </select>
                </div>
                <div v-if="selectedFolder == folder.id && folder.showOrder != 0" class="folder-name">
                  <input @change="changeFolderName" type="text" :value="folder.name" style="max-width: 150px; padding: 0;" />
                </div>
                <div v-else @click="selectFolderRename(folder.id)" class="folder-name">
                  <span>{{folder.name}}</span>
                </div>
                <div class="folder-feeds-count">
                  <span>{{folder.feeds.length}}</span>
                </div>
                <div class="folder-actions">
                  <svg class="icon" v-if="folder.name != 'No folder'" style="cursor: pointer;" @click="deleteFolder(folder.id, folder.name)" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="21" height="18" viewBox="0 0 64 64">
                    <path d="M12 64h40l4-44h-48zM40 8v-8h-16v8h-20v12l4-4h48l4 4v-12h-20zM36 8h-8v-4h8v4z"></path>
                  </svg>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <label>Article removal</label>
          <br />
          <small style="margin-bottom: 10px; display: inline-block;">Delete all articles that are older then {{data.articleDeleteInterval}} month(s).</small>
          <br />
          <select v-model="data.articleDeleteInterval">
            <option value="1">1 month</option>
            <option value="2">2 months</option>
            <option value="3">3 months</option>
            <option value="4">4 months</option>
          </select>
        </div>
        <div>
          <label>Article scan</label>
          <br />
          <small style="margin-bottom: 10px; display: inline-block;">Scan every {{data.articleScanInterval}} hour(s) for new articles.</small>
          <br />
          <select v-model="data.articleScanInterval">
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
            <option value="4">4 hours</option>
          </select>
        </div>
        <div>
          <label for="npbb">Next page button behavior</label>
          <br />
          <small>When loading the next page, set previous articles to read.</small>
          <br />
          <ToggleSwitch id="npbb" v-model="data.setArticlesReadOnNextPage" />
        </div>
        <div>
          <label for="eis">Infinite scroll</label>
          <br />
          <small>Remove the next page button and use infinite scroll.</small>
          <br />
          <ToggleSwitch id="eis" v-model="data.enableInfiniteScroll" />
        </div>
        <div>
          <button class="theme-color-background" @click="updateUserPreferences">Save</button>
        </div>
    </section>
</DefaultTemplate>
</template>
<script>
import DefaultTemplate from '@/components/DefaultTemplate.vue';
import ToggleSwitch from '@/components/inputs/ToggleSwitch.vue';
import axios from 'axios';

export default {
    name: "Settings",
    components: {
      DefaultTemplate,
      ToggleSwitch
    },
    data(){
      return({
        data: null,
        deleteTime: 1,
        scanTime: 1,
        folders: null,
        selectedFolder: null
      });
    },
    beforeMount(){
      this.getPreferences();
      let a = null;

      this.$eventHub.$on('foldersLoaded', () => {
        this.folders = this.$store.state.folders;
      });
    },
    methods:{
      async changeFolderName(event){

        let arrayIndex = null;

        this.folders.forEach((folder, index) => {
          if(folder.id === this.selectedFolder){
            if(event.target.value === ""){
              event.target.value = folder.name;
              return;
            }

            folder.name = event.target.value;
            arrayIndex = index;
          }
        });

        this.updateFolderOrder([this.folders[arrayIndex]]);
      },
      selectFolderRename(id){
        this.selectedFolder = id;
      },
      changeOrder(event, folder){
        const newVal = event.target.value;
        const oldVal = event.target.getAttribute('data-original-val');

        const toChange = [folder];

        this.folders.forEach(el => {
          if(el.showOrder === parseInt(newVal) && folder.name !== el.name){
            el.showOrder = parseInt(oldVal);
            toChange.push(el);
            return;
          }
        });

        this.updateFolderOrder(toChange);
      },
      async updateFolderOrder(ar){
        for(let i = 0; i < ar.length; i++){
          try{
            const el = ar[i];
            const response = await axios.put(`${process.env.VUE_APP_API}/folders/`,{
              name: el.name, 
              id: el.id, 
              showOrder: el.showOrder
            },{
              withCredentials: true,
              credentials: 'include'
            });

            if(response.status === 200){
              this.$eventHub.$emit('updateNavigation');
            }
            else if(response.status > 400){
              console.log(response);
            }
          }
          catch(error){
            console.log(error);
          }
        }
      },
      deleteFolder(id, name){
        if(!confirm(`Are you sure you want to delete the folder '${name}' and all it feeds?`))
          return;

        axios.delete(`${process.env.VUE_APP_API}/folders/${id}`,{
          withCredentials: true,
          credentials: 'include'
        })
        .then(response => {
          if(response.status === 200){
            for(let i = 0; i < this.folders.length; i++){
              if(this.folders[i].id === id){
                this.folders.splice(i,1);
              }
            }
          }
        })
        .catch(error => {
          alert('error while deleting folder');
          console.log(error);
        })
      },
      updateUserPreferences(){
        axios.put(`${process.env.VUE_APP_API}/preferences`,{
          articleDeleteInterval: this.data.articleDeleteInterval,
          articleScanInterval: this.data.articleScanInterval,
          setArticlesReadOnNextPage: Number(this.data.setArticlesReadOnNextPage),
          enableInfiniteScroll: Number(this.data.enableInfiniteScroll),
          darkmode: 0
        },{
          withCredentials: true,
          credentials: 'include'
        })
        .then(response => {
            if(response.status === 200){
              alert("Preferences has been saved.");
              this.$store.commit('setPreferences', response.data);
            }
        })
        .catch(error => {
          alert('Error updating user preferences');
          console.log(error);
        })
      },
      getPreferences(){
        axios.get(`${process.env.VUE_APP_API}/preferences`,{
          withCredentials: true,
          credentials: 'include'
        })
        .then(response => {
          this.data = response.data;
        })
        .catch(error => {
          console.log(error);
          alert('Error loading user preferences');
        })
      }
    }
}
</script>
<style scoped>
.icon
{
  fill : #000;
}
label{
  margin: 0;
  margin-top: 10px;
}
small{
  margin-bottom: 10px;
}
select{
  width: 200px;
}
select option{
  text-align: center;
}
ul{
  padding: 0;
}
ul li{
  list-style-type: none;
  padding: 0 5px;
}
ul li span{
  font-size: 18px !important;
}
ul li:first-child
{
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  width: 400px;
}
.folder-name, .folder-feeds-count, .folder-actions, .folder-order
{
  padding: 5px;
}
.folder-order
{
  min-width: 50px;
}
.folder-order select
{
    width: 40px;
    border: none;
    padding: 5px 10px;
    width: auto;
    outline: none;
    -webkit-appearance: none;
    cursor: pointer;
}
select
{
  border-radius: 5px;
  padding: 5px;
  border: 1px solid rgba(0,0,0, 0.1);
  outline-color: #5867FC;
  width: 250px;
}
button
{
    border-radius: 5px;
    padding: 5px;
    border: 1px solid rgba(0,0,0, 0.1);
    color: #FFF;
    width: 100px;
    margin-top: 10px;
}
.folder-name
{
  flex-shrink: 1;
  min-width: 150px;
  width: auto;
}
.folder-name input[type="text"]
{
  font-size: 18px;
  border-radius: 5px;
  padding: 5px;
  border: none;
}
.folder-feeds-count{
  flex-shrink: 1;
  min-width: 50px;
  text-align: center;
}
@media (prefers-color-scheme: dark)
{
  .icon
  {
    fill: #fff !important;
  }
}
</style>