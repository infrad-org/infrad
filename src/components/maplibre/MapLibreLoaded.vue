<template>
  <template v-if="loaded">
    <slot />
  </template>
</template>

<script setup lang="ts">
import { injectMapLibre } from './map.provide';

const { loaded } = injectMapLibre();
</script>