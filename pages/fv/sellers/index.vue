<template>
  <div class="w-full max-w-lg flex flex-col items-end gap-y-4">
    <div>
      
      <UButton
        icon="i-heroicons-plus"
        size="sm"
        color="primary"
        variant="solid"
        label="Hinzufügen"
        to="/fv/sellers/create"
      />
    </div>
    <div class="w-full rounded bg-white dark:bg-gray-900 shadow">
      <UTable
        :loading="pending"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
        class="w-full"
        :rows="data !== null ? data : []"
        :columns="columns"
      >
      </UTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Seller } from '~/interfaces/Seller';

definePageMeta({
  middleware: 'auth',
  layout: 'protected',
});

const authStore = useAuthStore();

const { data, pending, error, refresh } = useFetch<Seller[]>('/api/sellers', {
  headers: {
    Authorization: `Bearer ${authStore.token}`
  },
});

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'fullName', label: 'Name' },
  { key: 'matriculationNumber', label: 'Matr-Nr.' },
  { key: 'email', label: 'Email' },
];
</script>