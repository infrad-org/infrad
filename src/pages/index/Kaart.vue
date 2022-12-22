<template>
  <div>
    <MapLibre class="w-500px h-300px mx-auto" :interactive="false"/>
    <div class="flex justify-center">
      <a href="/kaart">
      <button class="p-5 bg-#7a2601 text-#f8aa84 my-5 text-xl rounded">Bekijk de kaart</button>
    </a>
    </div>

  </div>
</template>

<script setup lang="ts">
import MapLibre from '../../components/maplibre/MapLibre.vue';
</script>