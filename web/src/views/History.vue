<template>
  <DefaultTemplate>
    <section>
      <h1>History</h1>
      <div>
        <span>Last 25 articles read</span>
          <div v-if="data">
            <Article v-for="article in data" :key="article.id" :data="article" />
          </div>
          <div v-else>
            <ArticleSkeleton v-for="index in 4" :key="index" />
          </div>
      </div>
    </section>
  </DefaultTemplate>
</template>

<script>
import Article from '@/components/Article.vue';
import ArticleSkeleton from '@/components/ArticleSkeleton.vue';
import DefaultTemplate from '@/components/DefaultTemplate.vue';
import axios from 'axios';

export default {
  name: 'History',
  components: {
    Article,
    ArticleSkeleton,
    DefaultTemplate
  },
  mounted(){
      this.getData();
  },
  data(){
    return({
        data: null
    });
  },
  methods:{
      getData(){
          axios.get(`${process.env.VUE_APP_API}/history`)
          .then(response => {
              if(response.status === 200){
                  this.data = response.data;
              }
          })
          .catch(error => {
              console.log(error);
          })
      }
  }
}
</script>
