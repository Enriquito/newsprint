<template>
  <DefaultTemplate>
    <section>
        <h1>Internal server error</h1>
        <h5>Well, that did not go wel.</h5>
        <h5>Go back to home. Or try again later.</h5>
    </section>
  </DefaultTemplate>
</template>
<script>
import DefaultTemplate from '@/components/DefaultTemplate.vue';

export default {
    name: "ServerError",
    components: {
          DefaultTemplate
    }
}
</script>