<template>
  <div class="content-wrapper">
    <MobileMenuIcon />
    <Navigation />
    <section>
        <h1>Internal server error</h1>
        <h5>Well, that did not go wel.</h5>
        <h5>Go back to home. Or try again later.</h5>
    </section>
  </div>
</template>
<script>
import MobileMenuIcon from '@/components/MobileMenuIcon.vue';
import Navigation from '@/components/Navigation.vue';

export default {
    name: "ServerError",
    components: {
          MobileMenuIcon,
          Navigation
    }
}
</script>