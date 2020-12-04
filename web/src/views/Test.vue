<template>
  <div>
    <Navigation />
    <section>
        <h1 @click="test">Test</h1>
        <Overlay>
          <h2>Test</h2>
          <div>
            <label>Feed</label>
            <br />
            <input type="text" placeholder="Enter the feed url" />
          </div>
          <div>
            <label>Display name</label>
            <br />
            <input type="text" placeholder="Enter a custom display name" />
          </div>
          <div>
            <label>Folder</label>
            <br />
            <select>
              <option>News</option>
              <option>Technology</option>
            </select>
            <div style="margin-top: 10px" class="d-flex justify-content-center">
              <button>Save</button>
            </div>
          </div>
        </Overlay>
    </section>
  </div>
</template>
<script>
import Overlay from '@/components/Overlay.vue';
import Navigation from '@/components/Navigation.vue';

export default {
    name: "Test",
    components: {
          Overlay,
          Navigation
    },
    methods:{
      test(){
        this.$eventHub.$emit('toggle-overlay');
      }
    }
}
</script>
<style scoped>
section
{
  width: 100%;
  height: 100%;
  text-align: start;
  padding-left: 50px;
  margin-left: 350px;
}
section h1
{
    font-size: 70px;
    font-weight: 500;
    font-style: italic;
    margin-top: 70px;
    margin-bottom: 60px;
}


</style>