<template>
  <div class="flex-grow w-full flex flex-col items-center gap-y-6">
    <section class="z-10 sticky top-0 py-2 w-full bg-gray-50 dark:bg-gray-950/30">
      <div class="max-w-3xl mx-auto flex flex-col justify-items-stretch gap-y-2">
        <UInput
          v-model="searchQuery"
          size="xl"
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
          <SearchFilterMarked v-model="filter.marked.value.marked" />
          <SearchFilterExam v-model:exam-filter="filter.exam" />
          <SearchFilterOfferActive v-model="filter.active.active" />
        </div>
      </div>
    </section>
    <section class="w-full max-w-3xl mx-auto">
      <div v-if="offerResults?.count !== 0">
        <div class="flex flex-col">
          <SearchResultOffer v-for="offer in offerResults?.results" :key="offer.id" :offer="offer" class="z-0" />
        </div>
      </div>
      <div v-else>
        No results found
      </div>
    </section>
    <section v-if="(offerResults?.count ?? 0) > 0" class="flex justify-center">
      <UPagination v-model="currentPage" :page-count="Number(itemsPerPage)" :total="offerResults !== null ? offerResults.count : 0" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import type { Offer } from '~/interfaces/Offer';
import type { Page } from '~/interfaces/Page';
import type { Filter, PriceFilter, MarkedFilter, ExamFilter, OfferActiveFilter } from '~/interfaces/SearchFilters';

useSeoMeta({
  title: 'Suche',
})

definePageMeta({
  layout: 'protected',
})

const searchQuery = ref(useRoute().query.q as string || '')
const searchQueryDebounced = refDebounced(searchQuery, 250)

onMounted(() => {
  parseQueryParams()
  search()
})

const { token } = useAuth()
const currentPage = ref(1)
const itemsPerPage = ref(10)
const filter = ref({
  price: {
    active: false,
    value: {
      min: undefined as number | undefined,
      max: undefined as number | undefined,
    }
  } as Filter<PriceFilter>,
  marked: {
    active: false,
    value: {
      marked: true as boolean,
    }
  } as Filter<MarkedFilter>,
  exam: {
    active: false,
    value: {
      exam: undefined as string | undefined,
    }
  } as Filter<ExamFilter>,
  active: {
    active: true as boolean,
  } as OfferActiveFilter,
})

const fetchParams = computed(() => ({
  limit: itemsPerPage.value,
  offset: (currentPage.value - 1) * itemsPerPage.value,
  search: searchQueryDebounced.value,
  price__lte: filter.value.price.value.max,
  price__gte: filter.value.price.value.min,
  marked: filter.value.marked.value.marked ? undefined : 'false',
  book__exam__name__icontains: filter.value.exam.value.exam,
  active: filter.value.active.active ? undefined : 'true',
}))

const { data: offerResults, refresh } = useFetch<Page<Offer>>(useRuntimeConfig().public.apiUrl + '/offers', {
  params: fetchParams,
  headers: {
    Authorization: `${token.value}`,
  },
  onResponse: async () => {
    await navigateTo({
      path: '/fv/search',
      query: {
        q: searchQueryDebounced.value,
        price_gte: filter.value.price.value.min,
        price_lte: filter.value.price.value.max,
        marked: filter.value.marked.value.marked?.toString(),
        exam: filter.value.exam.value.exam,
        active: filter.value.active.active?.toString(),
      },
    })
  },
})

async function search() {
  await navigateTo({
    path: '/fv/search',
    query: { q: searchQueryDebounced.value },
  })
  await refresh()
}

async function parseQueryParams() {
  const queryParams = useRoute().query

  filter.value.price.value.min = queryParams.price_gte ? Number(queryParams.price_gte) : undefined
  filter.value.price.value.max = queryParams.price_lte ? Number(queryParams.price_lte) : undefined
  filter.value.marked.value.marked = queryParams.marked === 'true' || !queryParams.marked
}
</script>