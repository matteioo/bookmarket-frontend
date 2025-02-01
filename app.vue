<template>
  <div class="bg-gray-50 dark:bg-gray-950">
    <NuxtLayout>
       <NuxtPage />
    </NuxtLayout>
  </div>

  <UNotifications />
</template>

<script setup lang="ts">
useHead({
  titleTemplate: title => title ? `${title} · Bücherbörse der FVJus` : 'Bücherbörse der FVJus',
})
</script>