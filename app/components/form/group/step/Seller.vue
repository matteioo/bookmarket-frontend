<template>
  <div class="flex flex-col gap-y-4">
    <div class="flex flex-col gap-y-2">
      <USelectMenu
        v-model="selected"
        v-model:search-term="searchTerm"
        :items="sellersPage?.results || []"
        :search-input="{
          placeholder: 'Suche nach Verkäufer:in...',
          icon: 'i-lucide-search',
        }"
        ignore-filter
        class="w-full"
        placeholder="Verkäufer:in auswählen"
        :loading="status === 'pending'"
      >
        <template #item-label="{ item }">
          {{ item.matriculationNumber }} &middot; {{ item.fullName }}
        </template>

        <template #default="{ modelValue: selectedItem }">
          <span v-if="selectedItem">{{ selectedItem.matriculationNumber }} &middot; {{ selectedItem.fullName }}</span>
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
            color="primary"
            variant="outline"
            label="Weiter"
            :disabled="!selected"
            @click="handleSearchSubmit"
          />
        </div>
      </div>
    </div>
  
    <USeparator label="ODER ANLEGEN" />
  
    <FormGroupSeller :on-submit="handleSubmit" button-variant="outline" />
  </div>
</template>

<script setup lang="ts">
import type { Seller } from '~/interfaces/Seller'
import type { Page } from '~/interfaces/Page'

const props = defineProps({
  onSubmit: {
    type: Function as PropType<(userData: Seller) => void>,
    required: true,
  },
  currentSeller: {
    type: Object as PropType<Seller>,
    required: false,
    default: null,
  },
})

const selected = ref<Seller>(props.currentSeller)

// This anonymous function is called by the USelectMenu component to pass the selected seller to the parent component
const handleSearchSubmit = () => {
  if (selected.value) {
    props.onSubmit(selected.value)
  } else {
    console.error('No seller selected')
  }
}

const searchTerm = ref<string>('')
const searchTermDebounced = useDebounce(searchTerm, 500)

const fetchParams = computed(() => ({
  search: searchTermDebounced.value,
  offset: 0,
  limit: 20,
}))

const { data: sellersPage, status } = await useApiFetch<Page<Seller>>('/sellers', {
  params: fetchParams,
  lazy: true,
  watch: [searchTermDebounced],
})

// This anonymous function is called by the FormGroup component to intercept the submitted data
const handleSubmit = (userData: Seller) => {
  if (userData) {
    props.onSubmit(userData)
  } else {
    console.error('No seller selected')
  }
}
</script>