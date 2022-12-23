<template>
  <div class="hidden" ref="popupRef">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useMap } from './map.provide';
import { Marker, Popup } from 'maplibre-gl';
import { onMounted, onUnmounted, onUpdated, Ref, ref } from 'vue';

const props = defineProps<{
  lngLat: [number, number]
}>();

const map = useMap();
const popupRef: Ref<HTMLElement | null> = ref(null);

const popup = new Popup({
  maxWidth: "50vw"
}).setHTML('');

function updatePopupHTML() {
  const html = popupRef.value?.innerHTML;
  if (!html) return;
  popup.setHTML(html);
}

onMounted(() => {
  updatePopupHTML();
});

onUpdated(() => {
  updatePopupHTML();
});

const marker = new Marker({
  color: '#ff7f2a',
  scale: window.devicePixelRatio > 1 ? 1.5 : 1
}).setLngLat(props.lngLat).addTo(map);

marker.setPopup(popup);

onUnmounted(() => {
  marker.remove();
});
</script>
