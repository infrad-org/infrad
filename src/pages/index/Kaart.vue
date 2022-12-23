<template>
  <div>
    <MapLibre class="w-500px h-300px mx-auto" :interactive="false"/>
    <div class="flex justify-center my-10">
      <a href="/kaart">
      <button class="lg:p-5 p-8 bg-#7a2601 text-#f8aa84 my-5 rounded-lg text-5xl lg:text-xl">Bekijk de kaart</button>
    </a>
    </div>

  </div>
</template>

<script setup lang="ts">
import MapLibre from '../../components/maplibre/MapLibre.vue';
</script>