<template>
  <USelectMenu
    v-model="selected"
    :loading="loading"
    :searchable="search"
    placeholder="Suche nach Verkäufer:in..."
    option-attribute="fullName"
    trailing
    by="id"
    class="w-full"
  >
    <template #label>
      <span v-if="selected" class="truncate">{{ selected?.matriculationNumber }} &middot; {{ selected?.fullName }}</span>
    </template>

    <template #option="{ option: person }">
      <span class="truncate">{{ person.matriculationNumber }} &middot; {{ person.fullName }}</span>
    </template>
  </USelectMenu>

  <div v-if="selected" class="w-full">
    <div class="grid grid-cols-4 gap-2">
      <DataLabel label="Name" :data="selected.fullName" class="col-span-3" />
      <DataLabel label="Matrikelnr." :data="selected.matriculationNumber" class="col-span-1" />
      <DataLabel label="Email" :data="selected.email" class="col-span-4" />
    </div>
    <div class="float-right">
      <UButton
        size="sm"
        color="primary"
        variant="outline"
        label="Weiter"
        :disabled="!selected"
        @click="handleSearchSubmit"
      />
    </div>
  </div>

  <UDivider label="ODER ANLEGEN" />
  <FormGroupSeller :onSubmit="handleSubmit" buttonVariant="outline" />
</template>

<script setup lang="ts">
import type { Seller } from '~/interfaces/Seller';
import type { Page } from '~/interfaces/Page';

const props = defineProps({
  onSubmit: {
    type: Function as PropType<(userData: Seller) => void>,
    required: true,
  },
  currentSeller: {
    type: Object as PropType<Seller>,
    required: false,
  },
});

const loading = ref(false);
const selected = ref(props.currentSeller);
const authStore = useAuthStore();

// This anonymous function is called by the USelectMenu component to pass the selected seller to the parent component
const handleSearchSubmit = () => {
  if (selected.value) {
    props.onSubmit(selected.value);
  } else {
    console.error('No seller selected');
  }
}

// This anonymous function is called by the FormGroup component to intercept the submitted data
const handleSubmit = (userData: Seller) => {
  if (userData) {
    props.onSubmit(userData);
  } else {
    console.error('No seller selected');
  }
}

// This function is called by the selectMenu component to search for sellers
async function search(query: string) {
  loading.value = true;
  
  const sellers = await $fetch<Page<Seller>>('/api/sellers', {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    params: {
      search: query,
      offset: 0,
      limit: 20,
    },
  });

  loading.value = false;
  return sellers.results;
}
</script>