<template>
  <div class="flex-grow flex flex-col items-center gap-y-4 w-full max-w-screen-md mx-auto">
    <div class="w-full inline-flex flex-row justify-between">
      <UInput placeholder="Suchen..." v-model="searchInput" />
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
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
        class="w-full"
        :rows="data !== null ? data.results : []"
        :columns="columns"
      >
      </UTable>
    </div>
    <div class="w-full flex flex-row justify-between text-gray-700 dark:text-gray-300">
      <div class="inline-flex items-center gap-x-2">
        <div>Seitengröße</div>
        <USelectMenu v-model="itemsPerPage" :options="pageSizes" />
      </div>
      <UPagination v-model="currentPage" :page-count="itemsPerPage" :total="data !== null ? data.count : 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Page } from '~/interfaces/Page';
import type { Seller } from '~/interfaces/Seller';

definePageMeta({
  layout: 'protected',
});

const { token } = useAuth();
const currentPage = ref(1);
const pageSizes = [5, 10, 20, 50];
const itemsPerPage = ref(10);
const searchInput = ref('');

const fetchParams = computed(() => ({
  limit: itemsPerPage.value,
  offset: (currentPage.value - 1) * itemsPerPage.value,
  search: searchInput.value,
}));

const { data, pending, error, refresh } = useFetch<Page<Seller>>(useRuntimeConfig().public.apiUrl + '/sellers', {
  headers: {
    Authorization: `${token.value}`,
  },
  params: fetchParams,
});

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'fullName', label: 'Name' },
  { key: 'matriculationNumber', label: 'Matr-Nr.' },
  { key: 'email', label: 'Email' },
];
</script>