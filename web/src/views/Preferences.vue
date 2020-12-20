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
                <div class="folder-name">
                  <span>{{folder.name}}</span>
                </div>
                <div class="folder-feeds-count">
                  <span>{{folder.feeds.length}}</span>
                </div>
                <div class="folder-actions">
                  <svg v-if="folder.name != 'No folder'" style="cursor: pointer;" @click="deleteFolder(folder.id, folder.name)" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="21" height="18" viewBox="0 0 64 64">
                    <path d="M12 64h40l4-44h-48zM40 8v-8h-16v8h-20v12l4-4h48l4 4v-12h-20zM36 8h-8v-4h8v4z" fill="#000000"></path>
                  </svg>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <label>Article removal internval</label>
          <br />
          <small>Delete all articles that are older then {{data.articleDeleteInterval}} month(s).</small>
          <br />
          <select v-model="data.articleDeleteInterval">
            <option value="1">1 month</option>
            <option value="2">2 months</option>
            <option value="3">3 months</option>
            <option value="4">4 months</option>
          </select>
        </div>
        <div>
          <label>Article scan internval</label>
          <br />
          <small>Scan every {{data.articleScanInterval}} hour(s) for new articles.</small>
          <br />
          <select v-model="data.articleScanInterval">
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
            <option value="4">4 hours</option>
          </select>
        </div>
        <div>
          <button @click="updateUserPreferences">Save</button>
        </div>
    </section>
</DefaultTemplate>
</template>
<script>
import DefaultTemplate from '@/components/DefaultTemplate.vue';
import axios from 'axios';

export default {
    name: "Settings",
    components: {
          DefaultTemplate
    },
    data(){
      return({
        data: null,
        deleteTime: 1,
        scanTime: 1,
        folders: null
      });
    },
    beforeMount(){
      this.getPreferences();
      let a = null;

      if(this.$store.state.folders === undefined){
            a = setInterval(() => {
                console.log("a");
                if(this.$store.state.folders !== undefined){
                    this.folders = this.$store.state.folders;
                    clearInterval(a);
                }
            }, 50);
      }
      else{
        this.folders = this.$store.state.folders;
      }
    },
    methods:{
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
            const response = await axios.put(`${process.env.VUE_APP_API}/folders/`, {name: el.name, id: el.id, showOrder: el.showOrder});

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

        axios.delete(`${process.env.VUE_APP_API}/folders/${id}`)
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
        axios.put('/preferences',{
          articleDeleteInterval: this.data.articleDeleteInterval,
          articleScanInterval: this.data.articleScanInterval,
          darkmode: 0
        })
        .catch(error => {
          alert('Error updating user preferences');
          console.log(error);
        })
      },
      getPreferences(){
        axios.get('/preferences')
        .then(response => {
          this.data = response.data;
        })
        .catch(error => {
          console.log(error);
          alert('Error updating user preferences');
        })
      }
    }
}
</script>
<style scoped>
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
  padding: 0 5px;
}
.folder-order
{
  min-width: 50px;
}
.folder-order select
{
  width: 40px;
  border: none;
  outline-color: #5867FC;
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
    background: #5867FC;
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
.folder-feeds-count{
  flex-shrink: 1;
  min-width: 50px;
  text-align: center;
}

</style>