<template>
  <div class="py-10">
    <div class="lg:hidden">
      <StripCarousel />
    </div>
    <div class="hidden lg:block">
      <StripDesktop />
    </div>
  </div>
</template>

<script setup lang="ts">
import StripDesktop from './StripDesktop.vue';
import StripCarousel from './StripCarousel.vue';
</script>