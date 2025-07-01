<template>
  <div class="animate-flyIn group rounded overflow-hidden" :class="{ 'hover:bg-white dark:hover:bg-gray-900': isActive, 'border border-orange-300 dark:border-orange-600 bg-orange-50/50 hover:bg-orange-50/25 dark:bg-orange-950/25 dark:hover:bg-orange-950/50': !isActive }">
    <div class="flex flex-row">
      <div class="flex-grow grid grid-cols-12 p-2 gap-x-2 gap-y-1">
        <DataLabel label="Titel" :data="props.modelValue.book.title" class="col-span-7" />
        <DataLabel label="Autoren" :data="props.modelValue.book.authors" class="col-span-5" />
        <DataLabel label="ISBN" :data="props.modelValue.book.isbn" class="col-span-3" />
        <DataLabel label="Auflage" :data="String(props.modelValue.book.edition)" class="col-span-2" />
        <DataLabel label="Angebot-ID" :data="String(props.modelValue.id)" class="col-span-3" />
        <DataLabel label="Ort" :data="props.modelValue.location" class="col-span-2" />
        <DataLabel label="Preis" :data="formatPrice(props.modelValue.price)" class="col-span-2" />
      </div>
      <UButton
        icon="i-heroicons-trash"
        size="sm"
        color="red"
        variant="ghost"
        class="flex-grow-0 rounded-none"
        @click="deleteItem"
      />
    </div>
    <div v-if="!isActive" class="p-2 flex flex-row items-center gap-x-2 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100">
      <UIcon name="i-heroicons-exclamation-triangle" class="flex-shrink-0 w-5 h-5" />
      <span class="text-sm">Dieses Buch ist nicht mehr verfügbar!</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Offer } from '~/interfaces/Offer';
import { formatPrice } from '~/utils/utils';

const props = defineProps({
  modelValue: {
    type: Object as () => Offer,
    required: true
  },
});

const emit = defineEmits(['delete-item']);

const isActive = computed(() => props.modelValue.active);

const deleteItem = () => {
  emit('delete-item', props.modelValue);
};
</script>