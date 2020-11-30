<template>
  <section>
        <h1>Test</h1>
        <ArticleSkeleton />
  </section>
</template>
<script>
import ArticleSkeleton from '@/components/ArticleSkeleton.vue';

export default {
    name: "Test",
    components: {
          ArticleSkeleton
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