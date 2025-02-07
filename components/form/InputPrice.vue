<template>
  <div class="w-full">
    <UInput ref="inputRef" :required="props.required" :size="(props.size as InputSize)" />
  </div>
</template>


<script setup lang="ts">
import type { InputSize } from '#ui/types'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  maxPrice: {
    type: Number,
    default: 999.99,
  },
  size: {
    type: String as PropType<InputSize>,
    default: 'xs',
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const { inputRef, numberValue } = useEuroCurrencyInput({ valueRange: { min: 0, max: props.maxPrice } })

const emit = defineEmits(['update:modelValue'])

watch (numberValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>