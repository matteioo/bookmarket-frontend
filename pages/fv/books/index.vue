<template>
  <div class="grow flex flex-col items-center gap-y-4 w-full mx-auto">
    <div class="w-full inline-flex flex-row justify-between">
      <UInput v-model="searchInput" placeholder="Suchen..." />
      <UButton color="primary" label="Hinzufügen" trailing-icon="i-heroicons-plus" to="/fv/books/create" />
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
          :content="{ align: 'end' }"
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
        :data="data?.results ?? []"
        :columns="columns"
        :column-visibility="columnVisibility"
      >
        <template #empty>
          <div class="flex flex-col items-center gap-y-2">
            <UIcon name="i-heroicons-circle-stack-20-solid" class="w-8 h-8 text-neutral-500 dark:text-neutral-400" />
            <span class="text-neutral-500 dark:text-neutral-400">Keine Verkäufer:in gefunden.</span>
          </div>
        </template>
        <template #loading>
          <div class="flex flex-col items-center gap-y-2">
            <UIcon name="i-lucide:loader-circle" class="w-8 h-8 text-neutral-500 dark:text-neutral-400 animate-spin" />
            <span class="text-neutral-500 dark:text-neutral-400">Lade Verkäufer:innen...</span>
          </div>
        </template>
      </UTable>
    </div>
    <div class="w-full flex flex-row justify-between text-neutral-700 dark:text-neutral-300">
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
import { formatPrice } from '#imports'
import type { TableColumn } from '@nuxt/ui'
import type { Book } from '~/interfaces/Book'

useSeoMeta({
  title: 'Buch-Übersicht',
})

definePageMeta({
  layout: 'protected',
})

const UIcon = resolveComponent('UIcon')
const table = useTemplateRef('table')
const columns: TableColumn<Book>[] = [
  {
    accessorKey: 'isbn',
    header: 'ISBN',
  },
  {
    accessorKey: 'title',
    header: 'Titel',
  },
  {
    accessorKey: 'authors',
    header: 'Autoren',
  },
  {
    accessorKey: 'maxPrice',
    header: () => h('div', { class: 'text-right' }, 'Max. Preis'),
    cell: ({ row }) => h('div', { class: 'text-right' }, formatPrice(row.getValue('maxPrice'))),
  },
  {
    accessorKey: 'edition',
    header: () => h('div', { class: 'text-right' }, 'Auflage'),
    cell: ({ row}) => h('div', { class: 'text-right' }, row.getValue('edition')),
  },
  {
    accessorKey: 'publisher',
    header: 'Verlag',
  },
  {
    accessorKey: 'exam',
    header: 'Prüfung',
    cell: ({ row }) => row.original.exam ? h('span', {}, row.original.exam.name) : h('span', { class: 'italic' }, 'Keine Prüfung'),
  },
]
const { token } = useAuth()
const currentPage = ref(1)
const pageSizes = [5, 10, 20, 50]
const itemsPerPage = ref(pageSizes[1])
const searchInput = ref('')

const fetchParams = computed(() => ({
  limit: itemsPerPage.value,
  offset: (currentPage.value - 1) * itemsPerPage.value,
  search: searchInput.value,
}))

const columnVisibility = ref({
})

const { data, pending } = useFetch<Page<Book>>(useRuntimeConfig().public.apiUrl + '/books', {
  headers: {
    Authorization: `${token.value}`,
  },
  params: fetchParams,
})
</script>