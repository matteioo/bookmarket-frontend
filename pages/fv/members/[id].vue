<template>
  <div>
    Test
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Mandatar:in-Profil',
});

definePageMeta({
  layout: 'protected',
  validate: async (route) => {
    // Check if the id is made up of digits
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  }
})
</script>