<template>
  <div class="animate-flyIn flex flex-row group hover:bg-white dark:hover:bg-gray-900 rounded overflow-hidden">
    <div class="flex-grow grid grid-cols-12 p-2 gap-x-2 gap-y-1">
      <DataLabel label="Titel" :data="props.modelValue.book.title" class="col-span-7" />
      <DataLabel label="Autoren" :data="props.modelValue.book.authors" class="col-span-5" />
      <DataLabel label="ISBN" :data="props.modelValue.book.isbn" class="col-span-2" />
      <DataLabel label="Auflage" :data="String(props.modelValue.book.edition)" class="col-span-1" />
      <DataLabel label="Prüfung" :data="props.modelValue.book.exam?.name ?? '-'" class="col-span-4" />
      <DataLabelInput label="Markiert" :model-value="props.modelValue.marked" @update:modelValue="value => props.modelValue.marked = value" class="col-span-1" />
      <DataLabelInput label="Preis" :model-value="props.modelValue.price" :hint="'Max. ' + props.modelValue.book.maxPrice" :errors="errors?.price" @update:modelValue="value => props.modelValue.price = value" class="col-span-2" />
      <DataLabelInput label="Lagerort" :model-value="props.modelValue.location" :errors="errors?.location" @update:modelValue="value => props.modelValue.location = value" class="col-span-2" />
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
  },
});

let errors = ref({count: 0, price: [], location: []} as Errors);

const emit = defineEmits(['delete-item', 'update:modelValue', 'update:hasErrors']);

const formValidate = (): Errors => {
  const errors: Errors = {count: 0, price: [], location: []};
  
  if (props.modelValue.location && props.modelValue.location.length > 5) errors.location.push('Max. 5 Zeichen')
  if (!props.modelValue.price) errors.price.push('Preis ist verpflichtend')
  if (props.modelValue.price > props.modelValue.book.maxPrice) errors.price.push('Preis ist zu hoch')
  if (props.modelValue.price && props.modelValue.price <= 0) errors.price.push('Preis muss positiv sein')
  if (props.modelValue.price && props.modelValue.price >= 1000) errors.price.push('Preis darf nicht größer als 1000 sein')

  errors.count = errors.price.length + errors.location.length;
  return errors
}

watchEffect(() => {
  errors.value = formValidate();
  emit('update:hasErrors', errors.value.count > 0);
  emit('update:modelValue', props.modelValue);
});

const deleteItem = () => {
  emit('delete-item', props.modelValue);
};

interface Errors {
  count: number;
  price: string[];
  location: string[];
}
</script>