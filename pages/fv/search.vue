<template>
  <div class="flex-grow w-full flex items-center justify-center">
    <div>
      <h1>Protected Search Page</h1>
      <p>Current user: {{ member?.username }}</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'protected',
});

const { data } = useAuth();

const member = ref(data.value);
</script>