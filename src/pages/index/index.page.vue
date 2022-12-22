<template>
  <div class="bg-#7a2601 flex flex-row py-2">
    <img src="/banner-webformaatdec2022.png" class="mx-auto max-w-screen" />

  </div>
  <div class="md:max-w-xl mx-auto">
    <OverInfrad class="my-10 mx-5" />
    <Uitleg />
  </div>
  <Strip />
  <Kaart />
</template>

<script setup lang="ts">
import Strip from './Strip.vue';
import OverInfrad from './over-infrad.md';
import Uitleg from './Uitleg.vue';
import Kaart from './Kaart.vue';
</script>