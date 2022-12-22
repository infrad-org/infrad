<template>
  <div ref="mapDiv">
    <template v-if="loaded">
      <slot />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { provideMap } from "./map.provide";

const mapDiv: Ref<HTMLElement | null> = ref(null);
const loaded = ref(false);
const { setMap } = provideMap({ loaded });

console.log("one maplibre coming up")

onMounted(() => {
  if (!mapDiv.value) throw new Error("mapDiv is null");
  const style = import.meta.env.VITE_MAPLIBRE_STYLE_URL;
  if (!style) throw new Error("style is null");

  var map = new maplibregl.Map({
    attributionControl: true,
    container: mapDiv.value,
    style: style || 'https://demotiles.maplibre.org/style.json', // stylesheet location
    center: [6.093763624871777, 52.512570496985035], // starting position [lng, lat]
    zoom: 12 // starting zoom
  });
  setMap(map);
  loaded.value = true;
});
</script>