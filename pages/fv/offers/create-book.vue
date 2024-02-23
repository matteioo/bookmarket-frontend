<template>
  <div class="flex-grow w-full flex items-center justify-center">
    <div class="w-full max-w-sm">
      Create book
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'protected',
});
</script>