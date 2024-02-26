<template>
  <div class="flex-grow w-full flex items-center justify-center">
    <div>
      <h1>Protected Search Page</h1>
      <p>Current user: {{ authStore.member?.username }}</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'protected',
});

const authStore = useAuthStore();
</script>