<template>
  <div class="animate-flyIn flex flex-row group hover:bg-white dark:hover:bg-gray-900 rounded overflow-hidden">
    <div class="flex-grow grid grid-cols-12 p-2 gap-x-2 gap-y-1">
      <DataLabel label="Titel" :data="props.modelValue.book.title" class="col-span-7" />
      <DataLabel label="Autoren" :data="props.modelValue.book.authors" class="col-span-5" />
      <DataLabel label="ISBN" :data="props.modelValue.book.isbn" class="col-span-3" />
      <DataLabel label="Auflage" :data="String(props.modelValue.book.edition)" class="col-span-7" />
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

const deleteItem = () => {
  emit('delete-item', props.modelValue);
};
</script>