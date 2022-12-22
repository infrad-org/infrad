<template>
  <!-- <v-card max-width="448" class="mx-auto"> -->
  <v-layout>
    <v-app-bar color="info" density="prominent" image="/banner-webformaatdec2022.png" style="position: block;">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Infrad</v-app-bar-title>

      <template v-slot:image>
        <v-img gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"></v-img>
      </template>

      <!-- <template v-slot:append>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template> -->
    </v-app-bar>
  </v-layout>
  <!-- </v-card> -->
</template>

<script setup lang="ts">

</script>