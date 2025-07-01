<template>
  <div class="flex-grow flex flex-col items-center gap-y-4 w-full mx-auto">
    <div class="w-full inline-flex flex-row justify-between">
      <UInput v-model="searchInput" placeholder="Suchen..." />
      <div class="inline-flex gap-x-4">
        <UPopover mode="hover" :popper="{ placement: 'bottom-end' }">
          <UButton color="primary" label="Hinzufügen" trailing-icon="i-heroicons-chevron-down-20-solid" />

          <template #panel>
            <div class="p-4 flex flex-col gap-y-2">
              <UButton
                icon="i-heroicons-plus"
                size="sm"
                color="primary"
                variant="outline"
                label="Buch hinzufügen"
                to="/fv/offers/create/book"
              />
              <UButton
                icon="i-heroicons-tag-solid"
                size="sm"
                color="primary"
                variant="solid"
                label="Angebot erstellen"
                to="/fv/offers/create"
              />
            </div>
          </template>
        </UPopover>
      </div>
    </div>
    <div class="w-full rounded bg-white dark:bg-gray-900 shadow divide-y divide-gray-200 dark:divide-gray-700">
      <div class="px-4 py-3">
        <USelectMenu v-slot="{ open }" v-model="selectedColumns" class="w-fit" :options="columns" multiple>
          <UButton color="gray" class="flex-1 justify-between">
            Spalten auswählen

            <UIcon name="i-heroicons-chevron-right-20-solid" class="w-5 h-5 transition-transform text-gray-400 dark:text-gray-500" :class="[open && 'transform rotate-90']" />
          </UButton>
        </USelectMenu>
      </div>
      <UTable
        :loading="pending"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Lade Angebote...' }"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Kein Angebot gefunden.' }"
        class="w-full"
        :rows="data !== null ? data.results : []"
        :columns="selectedColumns"
      >
        <template #seller-data="{ row }">
          <UButton color="gray" variant="ghost" class="-my-1.5 !text-inherit" :to="`/fv/sellers/${row.seller.id}`">{{ row.seller.matriculationNumber }} &middot; {{ row.seller.fullName }}</UButton>
        </template>

        <template #member-data="{ row }">
          <UButton color="gray" variant="ghost" class="-my-1.5 !text-inherit" :to="`/fv/members/${row.member.id}`">{{ row.member.username }}</UButton>
        </template>

        <template #active-data="{ row }">
          <div v-if="row.active"><UIcon name="i-heroicons-check-circle-20-solid" class="text-lg text-green-600" /></div>
          <div v-else><UIcon name="i-heroicons-x-circle-20-solid" class="text-lg text-orange-600" /></div>
        </template>

        <template #marked-data="{ row }">
          <UIcon v-if="row.marked" name="i-heroicons-paint-brush-20-solid" class="text-lg text-sky-600" />
          <span v-else />
        </template>

        <template #createdAt-data="{ row }">
          <span>{{ formatDate(row.createdAt) }}</span>
        </template>

        <template #modified-data="{ row }">
          <span>{{ formatDate(row.modified) }}</span>
        </template>

        <template #price-data="{ row }">
          <div class="text-right">{{ formatPrice(row.price) }}</div>
        </template>

        <template #book-data="{ row }">
          <UPopover mode="hover" :popper="{ placement: 'left' }">
            <UButton color="gray" variant="ghost" class="-my-1.5 !text-inherit">{{ row.book.isbn }}</UButton>

            <template #panel>
              <div class="p-4 w-full max-w-lg">
                <h4 class="w-full font-semibold truncate">{{ row.book.title }}</h4>
                <div class="w-full flex items-center gap-x-1">
                  <UIcon name="i-heroicons-user-group-16-solid" class="flex-shrink-0" />
                  <span class="flex-grow truncate text-sm">{{ row.book.authors }}</span>
                </div>
                <div class="flex items-center gap-x-2 justify-between flex-wrap">
                  <span>Auflage: {{ row.book.edition }}</span>
                  <span>Max. Preis: {{ formatPrice(row.book.maxPrice) }}</span>
                </div>
                <div v-if="row.book.exam" class="flex items-center gap-x-1">
                  <UIcon name="i-heroicons-academic-cap-16-solid" class="flex-shrink-0" />
                  <span class="flex-grow truncate text-sm">Prüfung: {{ row.book.exam.name }}</span>
                </div>
              </div>
            </template>
          </UPopover>
        </template>
      </UTable>
    </div>
    <div class="w-full flex flex-row justify-between text-gray-700 dark:text-gray-300">
      <div class="inline-flex items-center gap-x-2">
        <div>Seitengröße</div>
        <USelect v-model="itemsPerPage" :options="pageSizes" />
      </div>
      <UPagination v-model="currentPage" :page-count="Number(itemsPerPage)" :total="data !== null ? data.count : 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Page } from '~/interfaces/Page'
import type { Offer } from '~/interfaces/Offer'
import { formatDate, formatPrice } from '#imports'

useSeoMeta({
  title: 'Angebot-Übersicht',
})

definePageMeta({
  layout: 'protected',
})

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'createdAt', label: 'Erstellt' },
  { key: 'modified', label: 'Aktualisiert' },
  { key: 'seller', label: 'Verkäufer' },
  { key: 'active', label: 'Aktiv' },
  { key: 'marked', label: 'Beschriftet' },
  { key: 'location', label: 'Ort' },
  { key: 'member', label: 'FV-Mitglied' },
  { key: 'book', label: 'Buch-ISBN' },
  { key: 'price', label: 'Preis', class: 'text-right' },
]

const { token } = useAuth()
const currentPage = ref(1)
const pageSizes = [5, 10, 20, 50]
const itemsPerPage = ref(pageSizes[1])
const searchInput = ref('')
const selectedColumns = ref([...columns])

const fetchParams = computed(() => ({
  limit: itemsPerPage.value,
  offset: (currentPage.value - 1) * itemsPerPage.value,
  search: searchInput.value,
}))

const { data, pending } = useFetch<Page<Offer>>(useRuntimeConfig().public.apiUrl + '/offers', {
  headers: {
    Authorization: `${token.value}`,
  },
  params: fetchParams,
})

</script>