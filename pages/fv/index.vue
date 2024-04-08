<template>
  <h1 class="block text-2xl tracking-wide font-medium text-primary-600 dark:text-primary-400">Willkommen zurück, {{ member?.username }}!</h1>
  <div class="flex-grow w-full flex items-center justify-center">
    <div>
      <h1>Protected Index Page</h1>
      <p>Current user: {{ member?.id }}, {{ member?.email }}, {{ member?.username }}</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'protected',
});

const { data, token } = useAuth();

const member = ref(data.value);
</script>