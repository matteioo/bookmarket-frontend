<template>
  <div class="w-full">
    <UFormGroup :hint="hint && String(hint)" :error="errors.length > 0 ? errors[0] : undefined">
      <template #label>
        <span class="block text-sm text-gray-600 dark:text-gray-400">{{ label }}</span>
      </template>
      <template #default>
        <UInput ref="inputRef" :required="props.required" :size="(props.size as InputSize)" />
      </template>
    </UFormGroup>
  </div>
</template>


<script setup lang="ts">
import type { InputSize } from '#ui/types'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Number,
    default: 0,
  },
  errors: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  hint: {
    type: String,
    default: undefined,
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

const { inputRef, numberValue } = useEuroCurrencyInput({ valueRange: { max: props.maxPrice } })

const emit = defineEmits(['update:modelValue'])

watch (numberValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>