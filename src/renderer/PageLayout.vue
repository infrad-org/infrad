<template>
  <div class="flex flex-col justify-between h-screen">
    <Header />
    <Navigation />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import '@unocss/reset/antfu.css';
import 'uno.css';

import Header from './layout/Header.vue';
import Navigation from './layout/Navigation.vue';
import Footer from './layout/Footer.vue';
</script>

<style>
body {
  background-color: #f8aa84;
  font-family: sans-serif;
}

.md h1 {
  font-size: x-large;
  font-weight: bold;
  margin-top: 10px;
}

.md h2 {
  font-size: large;
  font-weight: bold;
  margin-top: 10px;
}

.md p {
  margin-top: 10px;
}
</style>