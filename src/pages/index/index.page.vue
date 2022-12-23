<template>
  <!-- <div class="bg-#7a2601 flex flex-row py-2">
    <img src="/banner-webformaatdec2022.png" class="mx-auto max-w-screen" />
  </div> -->
  <Banner />
  <div class="px-5 lg:max-w-2xl mx-auto text-5xl lg:text-lg leading-normal">
    <OverInfrad class="my-30 lg:my-10" />
    <Uitleg class="my-30 lg:my-20" />
  </div>
  <Strip />
  <Kaart class="my-30 lg:my-20" />
</template>

<script setup lang="ts">
import Strip from './Strip.vue';
import OverInfrad from './over-infrad.md';
import Uitleg from './Uitleg.vue';
import Kaart from './Kaart.vue';
import Banner from './Banner.vue';
</script>