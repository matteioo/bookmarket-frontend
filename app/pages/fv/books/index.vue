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
        :data="data?.results ?? []"
        :columns="columns"
        :column-visibility="columnVisibility"
        :ui="{ tr: 'group' }"
      >
        <template #actions-cell="{ row }">
          <div class="float-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <UButtonGroup orientation="horizontal" class="shadow-none">
              <UButton icon="i-heroicons-list-bullet" variant="ghost" color="primary" :to="`/fv/books/${row.getValue('isbn')}`" />
            </UButtonGroup>
          </div>
        </template>


        <template #empty>
          <div class="flex flex-col items-center gap-y-2">
            <UIcon name="i-heroicons-circle-stack-20-solid" class="w-8 h-8 text-neutral-500 dark:text-neutral-400" />
            <span class="text-neutral-500 dark:text-neutral-400">Keine Bücher gefunden.</span>
          </div>
        </template>
        <template #loading>
          <div class="flex flex-col items-center gap-y-2">
            <UIcon name="i-lucide:loader-circle" class="w-8 h-8 text-neutral-500 dark:text-neutral-400 animate-spin" />
            <span class="text-neutral-500 dark:text-neutral-400">Lade Bücher...</span>
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
  }, {
    accessorKey: 'title',
    header: 'Titel',
    meta: {
      class: {
        td: 'max-w-50 break-words whitespace-normal',
      },
    }
  }, {
    accessorKey: 'authors',
    header: 'Autoren',
    meta: {
      class: {
        td: 'max-w-50 break-words whitespace-normal',
      },
    }
  }, {
    accessorKey: 'publisher',
    header: 'Verlag',
    meta: {
      class: {
        td: 'max-w-50 break-words whitespace-normal',
      },
    }
  }, {
    accessorKey: 'edition',
    meta: {
      class: {
        th: 'text-center',
      },
    },
    header: 'Auflage',
    cell: ({ row}) => h('div', { class: 'text-center' }, row.getValue('edition')),
  }, {
    accessorKey: 'exam',
    header: 'Prüfung',
    cell: ({ row }) => row.original.exam ? h('span', {}, row.original.exam.name) : h('span', { class: 'italic' }, 'Keine Prüfung'),
  }, {
    accessorKey: 'maxPrice',
    meta: {
      class: {
        th: 'text-right',
      },
    },
    header: 'Max. Preis',
    cell: ({ row }) => h('div', { class: 'text-right' }, formatPrice(row.getValue('maxPrice'))),
  }, {
    id: 'actions',
    enableHiding: false,
  }
]
const { token } = useAuth()
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
})

const { data, pending } = useFetch<Page<Book>>(useRuntimeConfig().public.apiUrl + '/books', {
  headers: {
    Authorization: `${token.value}`,
  },
  params: fetchParams,
})
</script>