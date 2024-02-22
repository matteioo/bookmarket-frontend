<template>
  <h1 class="block text-2xl tracking-wide font-medium text-primary-600 dark:text-primary-400">Willkommen zurück, {{ authStore.user?.username }}!</h1>
  <div class="flex-grow w-full flex items-center justify-center">
    <div>
      <h1>Protected Index Page</h1>
      <p>Current user: {{ authStore.user?.id }}, {{ authStore.user?.email }}, {{ authStore.user?.username }}</p>
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