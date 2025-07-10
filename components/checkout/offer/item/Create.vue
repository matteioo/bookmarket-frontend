<template>
  <div
    class="animate-fly-in flex flex-row rounded-sm overflow-hidden hover:bg-white dark:hover:bg-neutral-900"
    :class="{'ring-2 ring-info-500/40': currentPriceBinsIsbn === localOffer.book.isbn}">
    <div class="grow grid grid-cols-12 p-2 gap-x-2 gap-y-1">
      <DataLabel label="Titel" :data="localOffer.book.title" class="col-span-7" />
      <DataLabel label="Autoren" :data="localOffer.book.authors" class="col-span-5" />
      <DataLabel label="ISBN" :data="localOffer.book.isbn" class="col-span-2" />
      <DataLabel label="Auflage" :data="String(localOffer.book.edition)" class="col-span-1" />
      <DataLabel label="Prüfung" :data="localOffer.book.exam?.name ?? '-'" class="col-span-4" />
      <DataLabelInput
        v-model="localOffer.marked"
        label="Markiert"
        class="col-span-1"
      />
      <DataLabelInputPrice
        v-model="localOffer.price"
        label="Preis"
        :hint="`Max. ${Math.floor(localOffer.book.maxPrice)} €`"
        :max-price="Math.floor(localOffer.book.maxPrice)"
        :required="true"
        :errors="errors.price"
        class="col-span-2"
        size="xs"
      />
      <DataLabelInput
        v-model="localOffer.location"
        label="Lagerort"
        :errors="errors.location"
        class="col-span-2"
      />
    </div>
    <UButton
      icon="i-heroicons-currency-euro"
      color="info"
      variant="ghost"
      class="grow-0 rounded-none"
      @click="fetchOfferPrices"
    />
    <UButton
      icon="i-heroicons-trash"
      color="error"
      variant="ghost"
      class="grow-0 rounded-none"
      @click="deleteItem"
    />
  </div>
</template>

<script setup lang="ts">
import type { Offer } from '~/interfaces/Offer'

interface Errors {
  location: string[]
  price: string[]
}

const props = defineProps({
  modelValue: {
    type: Object as () => Offer,
    required: true
  },
  currentPriceBinsIsbn: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  'delete-item': [item: Offer]
  'fetch-price-bins': [isbn: string]
  'update:modelValue': [value: Offer]
  'update:hasErrors': [value: boolean]
}>()

const localOffer = shallowReactive<Offer>({
  ...props.modelValue,
  price: parseInt(String(props.modelValue.price), 10)
})
const errors = ref<Errors>({ location: [], price: [] })

const formValidate = () => {
  const localErrors: Errors = { location: [], price: [] }

  if (localOffer.location && localOffer.location.length > 5) localErrors.location.push('Max. 5 Zeichen')
  if (localOffer.price == null) localErrors.price.push('Preis erforderlich')

  return localErrors
}

watch(
  () => localOffer,
  (newVal) => {
    errors.value = formValidate()
    
    if (errors.value.location.length > 0 || errors.value.price.length > 0) {
      emit('update:hasErrors', true)
    } else {
      emit('update:hasErrors', false)
      emit('update:modelValue', { ...newVal })
    }
  },
  { deep: true, immediate: true }
)

const fetchOfferPrices = () => {
  emit('fetch-price-bins', localOffer.book.isbn)
}

const deleteItem = () => {
  emit('delete-item', props.modelValue)
}
</script>