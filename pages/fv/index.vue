<template>
  <div class="flex-grow flex flex-col">
    <h1 class="block text-2xl tracking-wide font-medium text-primary-600 dark:text-primary-400">Willkommen zurück, {{ member?.username }}!</h1>
    <div class="my-10 grid grid-cols-4 gap-4">
      <WidgetsStatisticsSoldBooks />
      <WidgetsStatisticsRevenue />
      <WidgetsStatisticsRevenue class="col-span-2 row-span-2" />
      <WidgetsStatisticsRevenue />
      <!-- Widgets: Meistgesucht, Meistverkauft -->
    </div>
    <div class="flex-grow w-full flex items-center justify-center">
      <div>
        <UInput
          v-model="searchQuery"
          class="mb-4"
          name="q"
          placeholder="Suche nach ISBN, Titel, Autor, ..."
          autocomplete="off"
          :ui="{ icon: { leading: { pointer: '' }, trailing: { pointer: '' } } }"
          @keydown.enter="search"
        >
          <template #leading>
            <UButton
              color="gray"
              variant="link"
              icon="i-heroicons-magnifying-glass-20-solid"
              :padded="false"
              @click="search"
            />
          </template>
          <template #trailing>
            <UButton
              v-show="searchQuery !== ''"
              color="gray"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click="searchQuery = ''"
            />
          </template>
        </UInput>
        <h1>Protected Index Page</h1>
        <p>Current user: {{ member?.id }}, {{ member?.email }}, {{ member?.username }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Dashboard',
})

definePageMeta({
  layout: 'protected',
})

const { data: member } = useAuth()
const searchQuery = ref('')

async function search() {
  if (searchQuery.value && searchQuery.value !== '') {
    await navigateTo({
      path: '/fv/search',
      query: { q: searchQuery.value },
    })
  }
}
</script>