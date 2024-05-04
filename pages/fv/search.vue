<template>
  <div class="flex-grow w-full flex flex-col items-center">
    <section class="z-10 sticky top-0 w-full py-6 bg-gray-50 dark:bg-gray-950">
      <UInput
        class="max-w-lg mx-auto"
        v-model="searchQuery"
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
    </section>
    <section class="w-full max-w-lg mx-auto">
      <div v-if="offerResults?.count !== 0">
        <div class="flex flex-col">
          <SearchResultOffer v-for="offer in offerResults?.results" :key="offer.id" :offer="offer" />
        </div>
      </div>
      <div v-else>
        No results found
      </div>
    </section>
    <section v-if="(offerResults?.count ?? 0) > 0" class="flex justify-center">
      <UPagination v-model="currentPage" :page-count="itemsPerPage" :total="offerResults !== null ? offerResults.count : 0" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import type { Offer } from '~/interfaces/Offer';
import type { Page } from '~/interfaces/Page';

definePageMeta({
  layout: 'protected',
});

const searchQuery = ref(useRoute().query.q || '')
const searchQueryDebounced = refDebounced(searchQuery, 250)

onMounted(() => {
  console.log('checking route')
  search()
  if (!useRoute().query.q || useRoute().query.q === '') {
    /* navigateTo({
      path: '/fv',

    }) */
  }
})

const { data: member, token } = useAuth()
const currentPage = ref(1);
const itemsPerPage = ref(10);

const fetchParams = computed(() => ({
  limit: itemsPerPage.value,
  offset: (currentPage.value - 1) * itemsPerPage.value,
  search: searchQueryDebounced.value,
}));

const { data: offerResults, pending, error, refresh } = useFetch<Page<Offer>>(useRuntimeConfig().public.apiUrl + '/offers', {
  headers: {
    Authorization: `${token.value}`,
  },
  params: fetchParams,
  onResponse: async (response) => {
    await navigateTo({
      path: '/fv/search',
      query: { q: searchQuery.value },
    })
  },
});

async function search() {
  if (!searchQuery.value || searchQuery.value === '') {
    return
  }

  console.log('searching for', searchQuery.value)
  await navigateTo({
    path: '/fv/search',
    query: { q: searchQuery.value },
  })
  await refresh()
  console.log('searched for', searchQuery.value, 'results:', offerResults.value)
}
</script>