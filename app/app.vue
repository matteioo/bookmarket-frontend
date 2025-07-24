<template>
  <UApp :locale="de">
    <Body class="bg-neutral-50 dark:bg-neutral-950" />
  
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { de } from '@nuxt/ui/locale'

useHead({
  htmlAttrs: {
    lang: 'de'
  },
  titleTemplate: title => title ? `${title} · Bücherbörse der FVJus` : 'Bücherbörse der FVJus',
})
</script>