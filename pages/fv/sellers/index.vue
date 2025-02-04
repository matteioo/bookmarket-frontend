<template>
  <div class="flex-grow flex flex-col items-center gap-y-4 w-full max-w-screen-lg mx-auto">
    <div class="w-full inline-flex flex-row justify-between">
      <UInput v-model="searchInput" placeholder="Suchen..." />
      <UButton
        icon="i-heroicons-plus"
        size="sm"
        color="primary"
        variant="outline"
        label="Hinzufügen"
        to="/fv/sellers/create"
      />
    </div>
    <div class="w-full rounded bg-white dark:bg-gray-900 shadow">
      <UTable
        :loading="pending"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Lade Verkäufer:innen...' }"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Keine Verkäufer:in gefunden.' }"
        class="w-full"
        :rows="data !== null ? data.results : []"
        :columns="columns"
        :ui="{ tr: { base: 'group' } }">
        <template #actions-data="{ row }">
          <div class="float-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <UButtonGroup size="sm" orientation="horizontal" class="shadow-none">
              <UButton icon="i-heroicons-information-circle" color="sky" variant="ghost" :to="`/fv/sellers/${row.id}`" />
              <UButton icon="i-heroicons-pencil-square" color="primary" variant="ghost" :to="`/fv/sellers/${row.id}`" />
              <UButton icon="i-heroicons-trash" color="red" variant="ghost" />
            </UButtonGroup>
          </div>
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
import type { Page } from '~/interfaces/Page';
import type { Seller } from '~/interfaces/Seller';

useSeoMeta({
  title: 'Verkäufer:innen-Übersicht',
});

definePageMeta({
  layout: 'protected',
});

const { token } = useAuth();
const currentPage = ref(1);
const pageSizes = [5, 10, 20, 50];
const itemsPerPage = ref(pageSizes[1]);
const searchInput = ref('');

const fetchParams = computed(() => ({
  limit: itemsPerPage.value,
  offset: (currentPage.value - 1) * itemsPerPage.value,
  search: searchInput.value,
}));

const { data, pending } = useFetch<Page<Seller>>(useRuntimeConfig().public.apiUrl + '/sellers', {
  headers: {
    Authorization: `${token.value}`,
  },
  params: fetchParams,
});

const columns = [
  { key: 'matriculationNumber', label: 'Matr-Nr.' },
  { key: 'fullName', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'actions', label: '' },
];
</script>