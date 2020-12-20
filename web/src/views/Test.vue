<template>
<DefaultTemplate>
  <section>
    <h1 @click="test">Test</h1>
    <ArticleSkeleton />
  </section>
</DefaultTemplate>
</template>
<script>
import ArticleSkeleton from '@/components/ArticleSkeleton.vue';
import DefaultTemplate from '@/components/DefaultTemplate.vue';

export default {
    name: "Test",
    components: {
          ArticleSkeleton,
          DefaultTemplate
    },
    methods:{
      test(){
        this.$eventHub.$emit('toggle-overlay');
      }
    }
}
</script>