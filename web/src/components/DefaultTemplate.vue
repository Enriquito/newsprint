<template>
  <div class="d-flex content-wrapper">
    <MobileMenuIcon />
    <Navigation />
    <slot>
        
    </slot>
  </div>
</template>
<script>
import MobileMenuIcon from '@/components/MobileMenuIcon.vue';
import Navigation from '@/components/navigation/Navigation.vue';

export default {
    name: "DefaultTemplate",
    components: {
          MobileMenuIcon,
          Navigation
    }
}
</script>