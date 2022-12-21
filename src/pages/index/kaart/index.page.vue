<template>
  <MapLibre>
    <template v-for="point in points">
      <Marker :lng-lat="point.location.coordinates">
        The id of this marker is {{ point.hashid }}.
        Description: {{ point.description }}
      </Marker>
    </template>
  </MapLibre>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import MapLibre from '../../../components/maplibre/MapLibre.vue';
import Marker from '../../../components/maplibre/Marker.vue';
import { onPoints } from './index.telefunc';

const points: Ref<null | Awaited<ReturnType<typeof onPoints>>> = ref(null);

onMounted(async () => {
  points.value = await onPoints([0, 0, 100, 100]);
})
</script>