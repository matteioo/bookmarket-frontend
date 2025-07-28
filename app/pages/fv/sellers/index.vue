<template>
  <div class="grow flex flex-col items-center gap-y-4 w-full max-w-(--breakpoint-lg) mx-auto">
    <div class="w-full inline-flex flex-row justify-between">
      <UInput v-model="searchInput" placeholder="Suchen..." />
      <UButton
        icon="i-heroicons-plus"
        color="primary"
        variant="outline"
        label="Hinzufügen"
        to="/fv/sellers/create"
      />
    </div>
    <div class="w-full rounded-sm bg-white dark:bg-neutral-900 shadow-sm">
      <UTable
        :loading="pending"
        :data="data?.results ?? []"
        :columns="columns"
        :ui="{ tr: 'group' }">
        <template #actions-cell="{ row }">
          <div class="float-end lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <UButtonGroup orientation="horizontal" class="shadow-none">
              <UButton icon="i-heroicons-information-circle" color="info" variant="ghost" :to="`/fv/sellers/${row.original.id}`" />
              <UButton icon="i-heroicons-pencil-square" color="primary" variant="ghost" @click="openModal(row.original)" />
              <UButton icon="i-heroicons-trash" color="error" variant="ghost" />
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
      <FormSellerEdit v-model="editSellerModal" :initial-seller="editSellerData" :on-submit="onEditSeller" />
    </div>
    <div class="w-full flex flex-col-reverse sm:flex-row items-center justify-between gap-y-4 text-neutral-700 dark:text-neutral-300">
      <div class="inline-flex items-center gap-x-2">
        <div>Seitengröße</div>
        <USelect v-model="itemsPerPage" :items="pageSizes" />
      </div>
      <UPagination v-model:page="currentPage" :items-per-page="Number(itemsPerPage)" :total="data?.count ?? 0" variant="outline" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Page } from '~/interfaces/Page'
import type { Seller } from '~/interfaces/Seller'

useSeoMeta({
  title: 'Verkäufer:innen-Übersicht',
})

definePageMeta({
  layout: 'protected',
})

const currentPage = ref<number>(1)
const pageSizes = [5, 10, 20, 50]
const itemsPerPage = ref<number>(pageSizes[1] ?? 10)
const searchInput = ref<string>('')
const editSellerModal = ref<boolean>(false)
const editSellerData = ref<Seller>({
  id: 0,
  matriculationNumber: '',
  fullName: '',
  email: '',
  note: '',
})

const fetchParams = computed(() => ({
  limit: itemsPerPage.value,
  offset: (currentPage.value - 1) * itemsPerPage.value,
  search: searchInput.value,
}))

const { data, pending, refresh } = useApiFetch<Page<Seller>>('/sellers', {
  params: fetchParams,
})

const columns: TableColumn<Seller>[] = [
  {
    accessorKey: 'matriculationNumber',
    header: 'Matr-Nr.',
  },
  {
    accessorKey: 'fullName',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'actions',
    enableHiding: false,
  }
]

const openModal = (seller: Seller) => {
  editSellerData.value = seller
  editSellerModal.value = true
}

const onEditSeller = async () => {
  refresh()
}
</script>