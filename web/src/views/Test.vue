<template>
  <div>
    <MobileMenuIcon />
    <Navigation />
    <section>
        <h1 @click="test">Test</h1>
        <ArticleSkeleton />
    </section>
  </div>
</template>
<script>
import MobileMenuIcon from '@/components/MobileMenuIcon.vue';
import Navigation from '@/components/Navigation.vue';
import ArticleSkeleton from '@/components/ArticleSkeleton.vue';

export default {
    name: "Test",
    components: {
          MobileMenuIcon,
          Navigation,
          ArticleSkeleton
    },
    methods:{
      test(){
        this.$eventHub.$emit('toggle-overlay');
      }
    }
}
</script>