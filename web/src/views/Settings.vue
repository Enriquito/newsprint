<template>
  <div>
    <MobileMenuIcon />
    <Navigation />
    <section>
        <h1>Settings</h1>

    </section>
  </div>
</template>
<script>
import Navigation from '@/components/Navigation.vue';
import MobileMenuIcon from '@/components/MobileMenuIcon.vue';

export default {
    name: "Settings",
    components: {
          Navigation,
          MobileMenuIcon
    },
    mounted(){

    },
    methods:{

    }
}
</script>