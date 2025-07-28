<template>
  <div class="grow flex flex-col items-center gap-y-4 w-full mx-auto">
    <div class="w-full inline-flex flex-row justify-between">
      <UInput v-model="searchInput" placeholder="Suchen..." />
      <div class="inline-flex gap-x-4">
        <UPopover mode="hover" :content="{ align: 'end', side: 'bottom' }">
          <UButton color="primary" label="Hinzufügen" trailing-icon="i-heroicons-chevron-down-20-solid" />

          <template #content>
            <div class="p-4 flex flex-col gap-y-2">
              <UButton
                icon="i-heroicons-tag"
                color="primary"
                variant="solid"
                label="Angebot erstellen"
                to="/fv/offers/create"
              />
              <UButton
                icon="i-lucide-tags"
                color="primary"
                variant="outline"
                label="Angebote erstellen"
                to="/fv/offers/batch"
              />
              <UButton
                icon="i-heroicons-plus"
                color="primary"
                variant="outline"
                label="Buch hinzufügen"
                to="/fv/books/create"
              />
            </div>
          </template>
        </UPopover>
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
        :loading="pending"
        :data="offers?.results ?? []"
        :columns="columns"
        :column-visibility="columnVisibility"
        :ui="{ tr: 'group' }"
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

        <template #actions-cell="{ row }">
          <div class="float-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <UButtonGroup orientation="horizontal" class="shadow-none">
              <UButton icon="i-heroicons-banknotes" variant="ghost" :color="row.getValue('active') ? 'primary' : 'neutral'"  :to="`/fv/sell/${row.getValue('id')}`" :disabled="!row.getValue('active')" />
              <UButton icon="i-lucide-book" variant="ghost" color="secondary"  :to="`/fv/books/${row.original.book.isbn}`" />
            </UButtonGroup>
          </div>
        </template>


        <template #empty>
          <div class="flex flex-col items-center gap-y-2">
            <UIcon name="i-heroicons-circle-stack-20-solid" class="w-8 h-8 text-neutral-500 dark:text-neutral-400" />
            <span class="text-neutral-500 dark:text-neutral-400">Keine Verkäufer:in gefunden.</span>
          </div>
        </template>
        <template #loading>
          <div class="flex flex-col items-center gap-y-2">
            <UIcon name="i-lucide-loader-circle" class="w-8 h-8 text-neutral-500 dark:text-neutral-400 animate-spin" />
            <span class="text-neutral-500 dark:text-neutral-400">Lade Verkäufer:innen...</span>
          </div>
        </template>
      </UTable>
    </div>
    <div class="w-full flex flex-col-reverse sm:flex-row items-center justify-between gap-y-4 text-neutral-700 dark:text-neutral-300">
      <div class="inline-flex items-center gap-x-2">
        <div>Seitengröße</div>
        <USelect v-model="itemsPerPage" :items="pageSizes" />
      </div>
      <UPagination v-model:page="currentPage" :items-per-page="Number(itemsPerPage)" :total="data?.count ?? 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Page } from '~/interfaces/Page'
import type { Offer } from '~/interfaces/Offer'
import { formatDate, formatPrice } from '#imports'
import type { TableColumn } from '@nuxt/ui'

useSeoMeta({
  title: 'Angebot-Übersicht',
})

definePageMeta({
  layout: 'protected',
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
    accessorKey: 'seller',
    header: 'Verkäufer:in',
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
    accessorKey: 'book',
    header: 'ISBN',
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
  }, {
    id: 'actions',
    enableHiding: false,
  }
]
const currentPage = ref<number>(1)
const pageSizes = [5, 10, 20, 50]
const itemsPerPage = ref<number>(pageSizes[1] ?? 10)
const searchInput = ref<string>('')

const fetchParams = computed(() => ({
  limit: itemsPerPage.value,
  offset: (currentPage.value - 1) * itemsPerPage.value,
  search: searchInput.value,
}))

const columnVisibility = ref({
  id: false,
  createdAt: false,
})

const { data, pending } = useApiFetch<Page<Offer>>('/offers', {
  key: 'offers',
  params: fetchParams,
})

const { data: offers } = useNuxtData('offers')
</script>