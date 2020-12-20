<template>
  <DefaultTemplate>
    <section>
        <h1>Page not found</h1>
        <h5>This page can not be found.</h5>
    </section>
  </DefaultTemplate>
</template>
<script>
import DefaultTemplate from '@/components/DefaultTemplate.vue';

export default {
    name: "NotFound",
    components: {
          DefaultTemplate
    }
}
</script>