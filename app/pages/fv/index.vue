<template>
  <div class="grow flex flex-col">
    <h1 class="block text-2xl tracking-wide font-medium text-primary-600 dark:text-primary-400">Willkommen zurück, {{ member?.username }}!</h1>
    <div class="my-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <WidgetsStatisticsSoldBooks />
      <WidgetsStatisticsRevenue />
      <WidgetsStatisticsRevenue class="sm:col-span-2 sm:row-span-2" />
      <WidgetsStatisticsRevenue />
      <WidgetsStatisticsSoldBooks />
      <!-- Widgets: Meistgesucht, Meistverkauft -->
    </div>
    <div class="grow w-full flex items-center justify-center">
      <div>
        <UInput
          v-model="searchQuery"
          class="mb-4"
          name="q"
          placeholder="Suche nach ISBN, Titel, Autor, ..."
          autocomplete="off"
          @keydown.enter="search"
        >
          <template #leading>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="i-heroicons-magnifying-glass-20-solid"
              class="cursor-pointer"
              :padded="false"
              @click="search"
            />
          </template>
          <template #trailing>
            <UButton
              v-if="searchQuery !== ''"
              color="neutral"
              variant="link"
              size="sm"
              icon="i-heroicons-x-mark-20-solid"
              class="cursor-pointer"
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