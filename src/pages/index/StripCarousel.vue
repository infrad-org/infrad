<template>
  <div class="w-full flex flex-row justify-center">
    <img :src="imgSrc[activeSlide]" class="max-w-xl">
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeSlide = ref(0);

const imgSrc = [
  "/Infradstrip1.png",
  "/Infradstrip2.png",
  "/Infradstrip3.png",
  "/Infradstrip4.png",
  "/Infradstrip5.png",
];

setInterval(() => {
  if (activeSlide.value + 1 === imgSrc.length) {
    activeSlide.value = 0;
  } else {
    activeSlide.value += 1;
  }
}, 6000);
</script>

<style>
.v-window__container {
  height: 0;
}
</style>