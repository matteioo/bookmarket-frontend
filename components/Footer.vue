<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <footer class="inline-flex gap-x-2 my-4 text-gray-400">
    <span>&copy; 2024 - Bücherbörse der FV Jus</span>
    <NuxtLink target="_blank" :to="`https://github.com/matteioo/bookmarket-frontend/releases/tag/${useRuntimeConfig().public.appVersion}`">
      <UBadge color="primary" variant="subtle">{{ useRuntimeConfig().public.appVersion }}</UBadge>
    </NuxtLink>
  </footer>
</template>