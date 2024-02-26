<template>
  <div class="flex flex-row group hover:bg-white dark:hover:bg-gray-900 rounded overflow-hidden">
    <div class="flex-grow grid grid-cols-12 p-2">
      <DataLabel label="Titel" :data="props.modelValue.book.title" class="col-span-7 truncate" />
      <DataLabel label="Autoren" :data="props.modelValue.book.authors" class="col-span-5 truncate" />
      
      <DataLabel label="ISBN" :data="props.modelValue.book.isbn" class="col-span-2" />
      <DataLabel label="Auflage" :data="String(props.modelValue.book.edition)" class="col-span-1" />
      <DataLabel label="Prüfung" :data="props.modelValue.book.exam.name" class="col-span-5 truncate" />
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

const props = defineProps({
  modelValue: {
    type: Object as () => Offer,
    required: true
  }
});

const emit = defineEmits(['delete-item', 'update:modelValue']);

watchEffect(() => {
  emit('update:modelValue', props.modelValue);
});

const deleteItem = () => {
  emit('delete-item', props.modelValue);
};
</script>