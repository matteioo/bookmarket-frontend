<template>
  <div class="mt-16">
    <UModal v-model:open="editHistoryModal">
      <template #content>
        <div class="p-4">
          TODO: Timeline
          <!-- <TimelineContainer>
            <TimelineItem icon="i-heroicons-user-plus-solid" variant="success" :member="member" :date-time="new Date('2024-04-18T03:24:12')" title="hat den Verkäufer angelegt" />
            
            <TimelineItem icon="i-heroicons-user-plus-solid" variant="info" :member="member" :date-time="new Date('2024-04-19T03:24:12')" title="hat den Verkäufer angeschaut" />
            
            <TimelineItem icon="i-heroicons-adjustments-horizontal-solid" variant="warning" :member="member" :date-time="new Date('2024-04-20T03:24:12')" title="hat den Verkäufer bearbeitet">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore veritatis iusto facere nostrum quas aspernatur repellendus atque voluptatibus minima ut, pariatur culpa? Dolores, sapiente voluptas consequuntur modi fuga et eos!
            </TimelineItem>
      
            <TimelineItem icon="i-heroicons-adjustments-horizontal-solid" variant="warning" :member="member" :date-time="new Date('2024-04-21T03:24:12')" title="hat den Verkäufer bearbeitet">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore veritatis iusto facere nostrum quas aspernatur repellendus atque voluptatibus minima ut, pariatur culpa? Dolores, sapiente voluptas consequuntur modi fuga et eos!
            </TimelineItem>
      
            <TimelineItem icon="i-heroicons-adjustments-horizontal-solid" variant="warning" :member="member" :date-time="new Date('2024-04-22T03:24:12')" title="hat den Verkäufer bearbeitet">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore veritatis iusto facere nostrum quas aspernatur repellendus atque voluptatibus minima ut, pariatur culpa? Dolores, sapiente voluptas consequuntur modi fuga et eos!
            </TimelineItem>
      
            <TimelineItem icon="i-heroicons-trash-solid" variant="error" :member="member" :date-time="new Date('2024-04-23T03:24:12')" title="hat den Verkäufer gelöscht" />
          </TimelineContainer> -->
        </div>
      </template>
    </UModal>
    
    <div class="grow flex flex-col gap-y-4 w-full max-w-(--breakpoint-lg) mx-auto">
      <section>
        <div class="flex items-start justify-between gap-x-2">
          <div class="inline-flex items-start gap-x-2">
            <h1 class="text-2xl tracking-wide font-medium text-primary-600 dark:text-primary-400">{{ book?.title }}</h1>
            <UButton icon="i-heroicons-pencil-square-solid" square variant="ghost" @click="editSellerModal = true" />
            <FormBookEdit v-if="book" v-model="editSellerModal" :initial-book="book" :on-submit="onEditSeller" />
          </div>
          <UButton label="Bearbeitungsverlauf" variant="outline" icon="i-heroicons-rectangle-stack" @click="editHistoryModal = true" />
        </div>
        <div class="grid grid-cols-2">
          <DataLabel label="Autor" :data="book?.authors" />
          <DataLabel label="Auflage" :data="String(book?.edition)" />
          <DataLabel label="Verlag" :data="book?.publisher" />
          <DataLabel label="ISBN" :data="book?.isbn" />
          <DataLabel label="Prüfung" :data="book?.exam?.name" />
          <DataLabel label="Max. Preis" :data="book?.maxPrice ? formatPrice(book?.maxPrice) : 'NaN'" />
        </div>
      </section>
      <section class="flex flex-col gap-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-x-2">
            <h2 class="text-xl font-medium text-primary-800 dark:text-primary-200">Angebote</h2>
            <UBadge v-if="offers?.count" color="primary" variant="subtle" size="md">{{ offers?.count }}</UBadge>
          </div>
          <UInput v-model="searchInput" placeholder="Suchen..." />
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
              <UButton color="neutral" variant="ghost" class="-my-1.5 text-inherit!" :to="`/fv/members/${row.original.member.id}`">{{ row.original.member.username }}</UButton>
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
        <div class="w-full flex flex-row justify-between text-neutral-700 dark:text-neutral-300">
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
import type { TableColumn } from '@nuxt/ui'
import type { Book } from '~/interfaces/Book'
import type { Offer } from '~/interfaces/Offer'
import type { Page } from '~/interfaces/Page'
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
const { token } = useAuth()
const route = useRoute()
const router = useRouter()
const editHistoryModal = ref(false)
const editSellerModal = ref(false)
const currentPage = ref(1)
const pageSizes = [5, 10, 20, 50]
const itemsPerPage = ref(pageSizes[1])
const searchInput = ref('')

const fetchParams = computed(() => ({
  limit: itemsPerPage.value,
  offset: (currentPage.value - 1) * itemsPerPage.value,
  search: searchInput.value,
  seller: route.params.id,
  book__isbn: route.params.isbn,
}))

const { data: book, refresh: refreshSellerData } = useFetch<Book>(useRuntimeConfig().public.apiUrl + '/books/' + route.params.isbn, {
  headers: {
    Authorization: `${token.value}`,
  },
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

const { data: offers, pending: loadingOffers } = useFetch<Page<Offer>>(useRuntimeConfig().public.apiUrl + '/offers', {
  headers: {
    Authorization: `${token.value}`,
  },
  params: fetchParams,
})

const columnVisibility = ref({
  id: false,
  createdAt: false,
})

const onEditSeller = async () => {
  refreshSellerData()
}
</script>
