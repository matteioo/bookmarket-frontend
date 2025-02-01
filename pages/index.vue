<template>
  <div>
    <h1 class="text-xl">This is the search page</h1>
    <RouterLink to="/login">Go to Login</RouterLink>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  ogTitle: 'Bückerbörse der FVJus',
  twitterTitle: 'Bückerbörse der FVJus',
  description: 'Verkaufe deine Bücher, bevor sie zu Staubfängern werden und schlage bei gebrauchten Büchern von anderen Studierenden zu. Die Bücherbörse der FVJus macht es möglich - ganz ohne Provision und Gebühren.',
  ogDescription: 'Verkaufe deine Bücher, bevor sie zu Staubfängern werden und schlage bei gebrauchten Büchern von anderen Studierenden zu. Die Bücherbörse der FVJus macht es möglich - ganz ohne Provision und Gebühren.',
  twitterDescription: 'Verkaufe deine Bücher, bevor sie zu Staubfängern werden und schlage bei gebrauchten Büchern von anderen Studierenden zu. Die Bücherbörse der FVJus macht es möglich - ganz ohne Provision und Gebühren.',
  ogImage: '',
  twitterCard: 'summary',
  themeColor: '#5c2849',
})

definePageMeta({
  auth: false
})
</script>