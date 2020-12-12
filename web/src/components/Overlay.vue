<template>
  <div v-if="open" @click="close" id="overlay" class="d-flex justify-content-center align-items-center">
      <div class="content">
            <slot></slot>
      </div>
  </div>
</template>

<script>

export default {
  name: 'Overlay',
    props:{
        name: String
    },
    mounted(){
        this.$eventHub.$on(`toggle-overlay-${this.name}`, () => {
                if(this.open)
                    this.open = false;
                else
                    this.open = true;
        })
    },
    data(){
        return({
            open: false
        });
    },
    methods:{
        close(event){
            if(event.target.id === 'overlay'){
                this.open = false;
            }
        }
    }
}
</script>
<style scoped>
#overlay
{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
}
#overlay .content
{
    background: #FFF;
    width: 400px;
    min-height: 200px;
    border-radius: 10px;
    padding: 30px;
    text-align: left;
}
#overlay .content label
{
    margin: 0;
    font-size: 0.8em;
}
#overlay .content input[type="text"]
{
    border: none;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    width: 100%;
    outline: none;
}
#overlay .content select
{
    border-radius: 5px;
    padding: 5px;
    border: 1px solid rgba(0,0,0, 0.1);
    outline: none;
    width: 100%;
}
#overlay .content button
{
    padding: 5px;
    border-radius: 5px;
    width: 100px;
    background: #fff;
    border: 1px solid rgba(0,0,0, 0.1);
    outline: none;
}
@media (max-width: 720px) {
    #overlay .content{
        width: 100% !important;
    }
}
</style>
