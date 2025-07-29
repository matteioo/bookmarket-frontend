<template>
  <div class="md:mt-16">
    <UModal v-model:open="editHistoryModal">
      <template #content>
        <div class="p-4">
          <UTimeline
            :items="timelineItems"
            size="xs"
            class="w-full"
            :ui="{
              date: 'float-end ms-1',
              description: 'px-3 py-2 ring ring-default mt-2 rounded-md text-default'
            }"
          >
            <template #title="{ item }">
              <span>{{ item.username }}</span>
              <span class="font-normal text-muted">&nbsp;{{ item.action }}</span>
            </template>

            <template #date="{ item }">
              {{ useTimeAgo(new Date(item.date)) }}
            </template>
          </UTimeline>
        </div>
      </template>
    </UModal>
    
    <div class="grow flex flex-col gap-y-4 w-full max-w-(--breakpoint-lg) mx-auto">
      <section>
        <div class="flex flex-col sm:flex-row justify-between gap-2">
          <div class="inline-flex items-start gap-x-2">
            <h1 class="text-xl md:text-2xl tracking-wide font-medium text-primary-600 dark:text-primary-400">{{ book?.title }}</h1>
            <UButton icon="i-heroicons-pencil-square-solid" square variant="ghost" @click="editSellerModal = true" />
            <FormBookEdit v-if="book" v-model="editSellerModal" :initial-book="book" :on-submit="onEditSeller" />
          </div>
          <UButton label="Bearbeitungsverlauf" variant="outline" icon="i-lucide-history" class="self-end" @click="editHistoryModal = true" />
        </div>
        <div class="mt-2 grid grid-cols-4">
          <DataLabel multi-line label="Autor" :data="book?.authors" class="col-span-4" />
          <DataLabel multi-line label="Verlag" :data="book?.publisher" class="col-span-4 lg:col-span-2" />
          <DataLabel multi-line label="Prüfung" :data="book?.exam?.name" class="col-span-4 lg:col-span-2" />
          <DataLabel multi-line label="ISBN" :data="book?.isbn" class="col-span-4 sm:col-span-2" />
          <DataLabel multi-line label="Auflage" :data="String(book?.edition)" class="col-span-2 sm:col-span-1" />
          <DataLabel label="Max. Preis" :data="book?.maxPrice ? formatPrice(book?.maxPrice) : 'NaN'" class="col-span-2 sm:col-span-1" />
        </div>
      </section>
      <section class="flex flex-col gap-y-4">
        <div class="flex items-center justify-between gap-x-2">
          <div class="flex items-center gap-x-1 sm:gap-x-2">
            <h2 class="sm:text-xl font-medium text-primary-800 dark:text-primary-200">Angebote</h2>
            <UBadge color="primary" variant="subtle" size="md">{{ offers?.count ?? 0 }}</UBadge>
          </div>
          <div class="flex items-center gap-x-2">
            <ClientOnly>
              <UModal>
                <UButton icon="i-lucide-chart-column-stacked" variant="soft" color="primary" />
  
                <template #content>
                  <div class="min-h-32 flex flex-col gap-y-4 p-4 rounded-sm bg-white dark:bg-neutral-900">
                    <div v-if="bookPriceBins">
                      <div class="h-48">
                        <ChartPriceBars :bins="bookPriceBins.priceBins" />
                      </div>
                      <div class="flex flex-col gap-y-1">
                        <div class="flex flex-row justify-between text-neutral-600 dark:text-neutral-400">
                          <span>Offene Angebote: {{ bookPriceBins.offerStats.totalCount.active }}</span>
                          <span>Verkaufte Bücher: {{ bookPriceBins.offerStats.totalCount.inactive }}</span>
                        </div>
                        <div class="flex flex-row justify-between text-neutral-600 dark:text-neutral-400">
                          <span>Durchschnittlicher Preis: {{ formatPrice(bookPriceBins.offerStats.averagePrice) }}</span>
                          <span>Median: {{ formatPrice(bookPriceBins.offerStats.medianPrice) }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <div class="flex flex-col gap-4">
                        <USkeleton class="h-32" />
                        <div class="grid grid-cols-2 gap-4">
                          <USkeleton class="h-8 w-full" />
                          <USkeleton class="h-8 w-full" />
                          <USkeleton class="h-8 w-full" />
                          <USkeleton class="h-8 w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </UModal>
            </ClientOnly>
            <UInput v-model="searchInput" placeholder="Suchen..." />
          </div>
        </div>
        <div class="w-full rounded-sm bg-white dark:bg-neutral-900 shadow-sm divide-y divide-neutral-200 dark:divide-neutral-700">
          <div class="px-4 py-3">
            <UDropdownMenu
              :items="
                table?.tableApi
                  ?.getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => ({
                    label: column.columnDef.header as string,
                    type: 'checkbox' as const,
                    checked: column.getIsVisible(),
                    onUpdateChecked(checked: boolean) {
                      table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                    },
                    onSelect(e?: Event) {
                      e?.preventDefault()
                    }
                  }))
              "
              :content="{ align: 'start' }"
            >
              <UButton
                label="Spalten"
                color="neutral"
                variant="outline"
                trailing-icon="i-lucide-chevron-down"
              />
            </UDropdownMenu>
          </div>
          <UTable
            ref="table"
            :loading="loadingOffers"
            :data="offers?.results ?? []"
            :columns="columns"
            :column-visibility="columnVisibility"
          >
            <template #seller-cell="{ row }">
              <UButton color="neutral" variant="ghost" class="-my-1.5 text-inherit!" :to="`/fv/sellers/${row.original.seller.id}`">{{ row.original.seller.matriculationNumber }} &middot; {{ row.original.seller.fullName }}</UButton>
            </template>

            <template #member-cell="{ row }">
              <UButton v-if="row.original.member" color="neutral" variant="ghost" class="-my-1.5 text-inherit!" :to="`/fv/members/${row.original.member.id}`">{{ row.original.member.username }}</UButton>
              <span v-else class="text-neutral-500 dark:text-neutral-400">-</span>
            </template>

            <template #book-cell="{ row }">
              <UPopover mode="hover" :popper="{ placement: 'left' }">
                <UButton color="neutral" variant="ghost" class="-my-1.5 text-inherit!">{{ row.original.book.isbn }}</UButton>

                <template #content>
                  <div class="p-4 w-full max-w-lg">
                    <h4 class="w-full font-semibold truncate">{{ row.original.book.title }}</h4>
                    <div class="w-full flex items-center gap-x-1">
                      <UIcon name="i-heroicons-user-group-16-solid" class="shrink-0" />
                      <span class="grow truncate text-sm">{{ row.original.book.authors }}</span>
                    </div>
                    <div class="flex items-center gap-x-2 justify-between flex-wrap">
                      <span>Auflage: {{ row.original.book.edition }}</span>
                      <span>Max. Preis: {{ formatPrice(row.original.book.maxPrice) }}</span>
                    </div>
                    <div v-if="row.original.book.exam" class="flex items-center gap-x-1">
                      <UIcon name="i-heroicons-academic-cap-16-solid" class="shrink-0" />
                      <span class="grow truncate text-sm">Prüfung: {{ row.original.book.exam.name }}</span>
                    </div>
                  </div>
                </template>
              </UPopover>
            </template>


            <template #empty>
              <div class="flex flex-col items-center gap-y-2">
                <UIcon name="i-heroicons-circle-stack-20-solid" class="w-8 h-8 text-neutral-500 dark:text-neutral-400" />
                <span class="text-neutral-500 dark:text-neutral-400">Keine Angebote gefunden.</span>
              </div>
            </template>
            <template #loading>
              <div class="flex flex-col items-center gap-y-2">
                <UIcon name="i-lucide:loader-circle" class="w-8 h-8 text-neutral-500 dark:text-neutral-400 animate-spin" />
                <span class="text-neutral-500 dark:text-neutral-400">Lade Angebote...</span>
              </div>
            </template>
          </UTable>
        </div>
        <div class="w-full flex flex-col-reverse sm:flex-row items-center justify-between gap-y-4 text-neutral-700 dark:text-neutral-300">
          <div class="inline-flex items-center gap-x-2">
            <div>Seitengröße</div>
            <USelect v-model="itemsPerPage" :items="pageSizes" />
          </div>
          <UPagination v-model:page="currentPage" :items-per-page="Number(itemsPerPage)" :total="offers?.count ?? 0" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn, TimelineItem } from '@nuxt/ui'
import type { Book } from '~/interfaces/Book'
import type { Offer } from '~/interfaces/Offer'
import type { Page } from '~/interfaces/Page'
import type { BookPriceBins } from '~/interfaces/PriceBin'
import { formatDate, formatPrice } from '~/utils/utils'

useSeoMeta({
  title: 'Buch-Details',
})

definePageMeta({
  layout: 'protected',
  validate: async (route) => {
    // Check if the ISBN is either 10 or 13 digits
    return typeof route.params.isbn === 'string' && /^\d{10}(\d{3})?$/.test(route.params.isbn)
  }
})

const { $api } = useNuxtApp()
const UIcon = resolveComponent('UIcon')
const table = useTemplateRef('table')
const columns: TableColumn<Offer>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'createdAt',
    header: 'Erstellt',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: 'modified',
    header: 'Aktualisiert',
    cell: ({ row }) => formatDate(row.original.modified),
  },
  {
    accessorKey: 'active',
    header: 'Aktiv',
    cell: ({ row }) => {
      if (row.original.active) {
        return h(UIcon, { name: 'i-heroicons-check-circle-20-solid', class: 'text-lg text-green-600' })
      } else {
        return h(UIcon, { name: 'i-heroicons-x-circle-20-solid', class: 'text-lg text-orange-600' })
      }
    }
  },
  {
    accessorKey: 'marked',
    header: 'Beschriftet',
    cell: ({ row }) => {
      if (row.original.marked) {
        return h(UIcon, { name: 'i-heroicons-paint-brush-20-solid', class: 'text-lg text-sky-600' })
      }
    }
  },
  {
    accessorKey: 'location',
    header: 'Ort',
  },
  {
    accessorKey: 'member',
    header: 'FV-Mitglied',
  },
  {
    accessorKey: 'price',
    meta: {
      class: {
        th: 'text-right',
      },
    },
    header: 'Preis',
    cell: ({ row }) => h('div', { class: 'text-right' }, formatPrice(row.original.price)),
  },
]
const timelineItems = [
  {
    username: 'J-Michalek',
    date: '2025-05-24T14:58:55Z',
    action: 'opened this',
    icon: 'i-lucide-git-pull-request',
  }, {
    username: 'J-Michalek',
    date: '2025-05-26T19:30:14+02:00',
    action: 'marked this pull request as ready for review',
    icon: 'i-lucide-check-circle',
  }, {
    username: 'benjamincanac',
    date: '2025-05-27T11:01:20Z',
    action: 'commented on this',
    description:
      "I've made a few changes, let me know what you think! Basically I updated the design, removed unnecessary divs, used Avatar component for the indicator since it supports icon already.",
    icon: 'i-lucide-message-square',
  }, {
    username: 'J-Michalek',
    date: '2025-05-27T11:01:20Z',
    action: 'commented on this',
    description: 'Looks great! Good job on cleaning it up.',
    icon: 'i-lucide-message-square',
  }, {
    username: 'benjamincanac',
    date: '2025-05-27T11:01:20Z',
    action: 'merged this',
    icon: 'i-lucide-git-merge',
  }
] satisfies TimelineItem[]
const route = useRoute()
const router = useRouter()
const editHistoryModal = ref<boolean>(false)
const editSellerModal = ref<boolean>(false)
const currentPage = ref<number>(1)
const pageSizes = [5, 10, 20, 50]
const itemsPerPage = ref<number>(pageSizes[1] ?? 10)
const searchInput = ref<string>('')
const bookPriceBins = ref<BookPriceBins | undefined>(undefined)

const isbn = Array.isArray(route.params.isbn) ? route.params.isbn[0] : route.params.isbn
if (isbn) {
  fetchPriceBins(isbn)
}

const fetchParams = computed(() => ({
  limit: itemsPerPage.value,
  offset: (currentPage.value - 1) * itemsPerPage.value,
  search: searchInput.value,
  book__isbn: route.params.isbn,
}))

const { data: book, refresh: refreshSellerData } = useApiFetch<Book>('/books/' + route.params.isbn, {
  onResponseError: () => {
    // Try to go back to the previous page
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to books overview if there's no history
      router.push('/fv/books')
    }
  },
})

const { data: offers, pending: loadingOffers } = useApiFetch<Page<Offer>>('/offers', {
  params: fetchParams,
})

const columnVisibility = ref({
  id: false,
  createdAt: false,
})

const onEditSeller = async () => {
  refreshSellerData()
}

async function fetchPriceBins(isbn: string) {
  await $api<BookPriceBins>(`/books/${isbn}/price-bins`)
  .then((res) => {
    bookPriceBins.value = res
  })
  .catch((error) => {
    console.error('Error while fetching price bins', error)
    bookPriceBins.value = undefined
  })
}
</script>
