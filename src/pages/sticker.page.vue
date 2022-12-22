<template>

</template>

<script setup lang="ts">
function redirect() {
    if (typeof window === 'undefined')
        return
    location.href = "/#uitleg";

}

redirect();
</script>