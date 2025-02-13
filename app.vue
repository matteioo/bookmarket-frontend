<template>
  <Body class="bg-gray-50 dark:bg-gray-950" />

  <div>
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

console.log('App.vue', useRuntimeConfig().public.apiUrl)
</script>