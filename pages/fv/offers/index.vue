<template>
  <div class="w-full max-w-screen-xl flex flex-col items-center gap-y-4">
    <div class="w-full inline-flex flex-row justify-between">
      <UInput placeholder="Suchen..." />
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
        <template #marked-data="{ row }">
          <UBadge size="xs" :label="row.marked ? 'Completed' : 'In Progress'" :color="row.marked ? 'green' : 'orange'" variant="soft" />
        </template>
        
        <template #active-data="{ row }">
          <div v-if="row.marked"><UIcon name="i-heroicons-x-circle-20-solid" class="text-lg text-red-600" /></div>
          <div v-else><UIcon name="i-heroicons-check-circle-20-solid" class="text-lg text-green-600" /></div>
        </template>
      </UTable>
    </div>
    <div>
      <UPagination v-model="currentPage" :page-count="itemsPerPage" :total="data !== null ? data.count : 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Page } from '~/interfaces/Page';
import type { Offer } from '~/interfaces/Offer';

definePageMeta({
  middleware: 'auth',
  layout: 'protected',
});

const authStore = useAuthStore();
const currentPage = ref(1);
const itemsPerPage = ref(2);

const fetchParams = computed(() => ({
  limit: itemsPerPage.value,
  offset: (currentPage.value - 1) * itemsPerPage.value,
}));

const { data, pending, error, refresh } = useFetch<Page<Offer>>('/api/offers', {
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  params: fetchParams,
});

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'seller', label: 'Verkäufer' },
  { key: 'isbn', label: 'ISBN' },
  { key: 'price', label: 'Preis' },
  { key: 'active', label: 'Aktiv' },
  { key: 'marked', label: 'Beschriftet' },
  { key: 'location', label: 'Ort' },
  { key: 'member', label: 'FV-Mitglied' },
  { key: 'createdAt', label: 'Erstellt' },
  { key: 'modified', label: 'Aktualisiert' },
];

</script>