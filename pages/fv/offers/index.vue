<template>
  <div class="flex-grow flex flex-col items-center gap-y-4 w-full max-w-screen-xl mx-auto">
    <div class="w-full inline-flex flex-row justify-between">
      <UInput placeholder="Suchen..." v-model="searchInput" />
      <div class="inline-flex gap-x-4">
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
    </div>
    <div class="w-full rounded bg-white dark:bg-gray-900 shadow">
      <UTable
        :loading="pending"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
        class="w-full"
        :rows="data !== null ? data.results : []"
        :columns="columns"
      >
        <template #seller-data="{ row }">
          <span>{{ row.seller.matriculationNumber }} &middot; {{ row.seller.fullName }}</span>
        </template>

        <template #member-data="{ row }">
          <span>{{ row.member.username }}</span>
        </template>

        <template #active-data="{ row }">
          <div v-if="row.active"><UIcon name="i-heroicons-check-circle-20-solid" class="text-lg text-green-600" /></div>
          <div v-else><UIcon name="i-heroicons-x-circle-20-solid" class="text-lg text-orange-600" /></div>
        </template>

        <template #marked-data="{ row }">
          <UIcon v-if="row.marked" name="i-heroicons-paint-brush-20-solid" class="text-lg text-sky-600" />
          <span v-else></span>
        </template>

        <template #createdAt-data="{ row }">
          <span>{{ formatDate(row.createdAt) }}</span>
        </template>

        <template #modified-data="{ row }">
          <span>{{ formatDate(row.createdAt) }}</span>
        </template>
      </UTable>
    </div>
    <div class="w-full flex flex-row justify-between">
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
import type { Offer } from '~/interfaces/Offer';

definePageMeta({
  middleware: 'auth',
  layout: 'protected',
});

const authStore = useAuthStore();
const currentPage = ref(1);
const pageSizes = [5, 10, 20, 50];
const itemsPerPage = ref(pageSizes[1]);
const searchInput = ref('');

const fetchParams = computed(() => ({
  limit: itemsPerPage.value,
  offset: (currentPage.value - 1) * itemsPerPage.value,
  search: searchInput.value,
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
  { key: 'price', label: 'Preis' },
  { key: 'active', label: 'Aktiv' },
  { key: 'marked', label: 'Beschriftet' },
  { key: 'location', label: 'Ort' },
  { key: 'member', label: 'FV-Mitglied' },
  { key: 'createdAt', label: 'Erstellt' },
  //{ key: 'modified', label: 'Aktualisiert' },
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('de-AT', options).format(date);
};

</script>