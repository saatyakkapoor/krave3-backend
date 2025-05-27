<template>
  <div>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import { useHead } from '#app';
useHead({
    htmlAttrs: {
        'data-theme': 'business',
    }
});
</script>