<template>
  <h1 class="block text-2xl tracking-wide font-medium text-primary-600 dark:text-primary-400">Willkommen zurück, {{ authStore.member?.username }}!</h1>
  <div class="flex-grow w-full flex items-center justify-center">
    <div>
      <h1>Protected Index Page</h1>
      <p>Current user: {{ authStore.member?.id }}, {{ authStore.member?.email }}, {{ authStore.member?.username }}</p>
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