<template>
  <UTable
    :loading="pending"
    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
    class="w-full"
    :rows="data !== null ? data : []"
    :columns="columns"
  >
  </UTable>
</template>

<script setup lang="ts">
import type { Offer } from '~/interfaces/Offer';

definePageMeta({
  middleware: 'auth',
  layout: 'protected',
});

const authStore = useAuthStore();

const { data, pending, error, refresh } = useFetch<Offer[]>('http://localhost:8000/api/v1/offers', {
  headers: {
    Authorization: `Bearer ${authStore.token}`
  },
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