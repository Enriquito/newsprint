<template>
  <div class="content-wrapper">
    <MobileMenuIcon />
    <Navigation />
    <section>
        <h1>Page not found</h1>
        <h5>This page can not be found.</h5>
    </section>
  </div>
</template>
<script>
import MobileMenuIcon from '@/components/MobileMenuIcon.vue';
import Navigation from '@/components/Navigation.vue';

export default {
    name: "NotFound",
    components: {
          MobileMenuIcon,
          Navigation
    }
}
</script>