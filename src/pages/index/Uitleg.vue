<template>
  <section id="uitleg" class="bg-#7a2601 text-#f8aa84 p-5">
    <h1 class="text-6xl lg:text-3xl font-bold text-center">~ Uitleg ~</h1>
    <p class="pt-7 lg:pt-5">Met Infrad kan je makkelijk jouw ideeën voor de publieke ruimte delen. Leuk dat je meedoet! De
      stappen zijn als
      volgt:</p>

    <ol class="pt-5 list-decimal">
      <li class="ml-10 py-3">📍 Stuur een locatie via WhatsApp.</li>
      <li class="ml-10 py-3">💬 Deel je mening of idee! Schrijf een tekstbericht.</li>
      <li class="ml-10 py-3">📸 Maak eventueel een foto om je idee nog duidelijker te maken.</li>
    </ol>

    <div class="flex justify-center">
      <a href="https://wa.me/31645519036">
        <button class="flex flex-row items-center lg:p-3 p-5 my-4 text-#7a2601 bg-#f8aa84 rounded-lg">
        <WhatsAppIcon class="fill-current mr-2 h-1em"/>
        Infrad op WhatsApp
    </button>
    </a>
    </div>

    <p class="py-5">🎉 Dat was het! Je idee wordt automatisch toegevoegd aan de kaart. Heb je vragen? Stuur een e-mail
      naar
      team@infrad.app.</p>
  </section>
</template>

<script setup lang="ts">
import WhatsAppIcon from '../../components/icons/WhatsApp.vue';
</script>