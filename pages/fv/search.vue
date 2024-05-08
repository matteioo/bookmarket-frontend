<template>
  <div class="flex-grow w-full flex flex-col items-center gap-y-6">
    <section class="z-10 sticky top-0 w-full bg-gray-50 dark:bg-gray-950">
      <div class="max-w-lg mx-auto flex flex-col justify-items-stretch gap-y-2">
        <UInput
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
        <div class="inline-flex flex-row justify-start gap-x-2">
          <SearchFilterPrice v-model:price-filter="filter.price" />
          <SearchFilterMarked v-model:marked-filter="filter.marked" />
        </div>
      </div>
    </section>
    <section class="w-full max-w-2xl mx-auto">
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

const searchQuery = ref(useRoute().query.q as string || '')
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
const filter = ref({
  price: {
    active: false,
    value: {
      min: undefined as number | undefined,
      max: undefined as number | undefined,
    },
  },
  marked: {
    active: false,
    value: {
      marked: true as boolean,
      unmarked: false as boolean,
    }
  }
});

const markedValue = () => {
  if (filter.value.marked.value.marked && filter.value.marked.value.unmarked) {
    return undefined
  } else if (filter.value.marked.value.marked) {
    return true
  } else if (filter.value.marked.value.unmarked) {
    return false
  }
}

const fetchParams = computed(() => ({
  limit: itemsPerPage.value,
  offset: (currentPage.value - 1) * itemsPerPage.value,
  search: searchQueryDebounced.value,
  price__lte: filter.value.price.value.max,
  price__gte: filter.value.price.value.min,
  marked: markedValue(),
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