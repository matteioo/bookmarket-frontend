<template>
  <UInputNumber
    v-model="modelValue"
    v-bind="$attrs"
    :min="min"
    :max="max"
    :format-options="formatOptions"
    :class="inputClass"
  />
</template>

<script setup lang="ts">
/**
 * A wrapper around UInputNumber with sensible defaults for price inputs.
 * 
 * Default configuration:
 * - Range: 0 to 999
 * - Currency: EUR with symbol display
 * - No decimal places
 * - Full width
 * 
 * All props can be overridden as needed.
 */

interface Props {
  /** The v-model value */
  modelValue?: number | null
  /** Minimum allowed value (default: 0) */
  min?: number
  /** Maximum allowed value (default: 999) */
  max?: number
  /** Number formatting options (default: EUR currency format) */
  formatOptions?: Intl.NumberFormatOptions
  /** CSS classes for the input (default: 'w-full') */
  class?: string
}

interface Emits {
  (e: 'update:modelValue', value: number | null): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  min: 0,
  max: 999,
  formatOptions: () => ({
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'symbol',
    currencySign: 'accounting',
    maximumFractionDigits: 0,
  }),
  class: 'w-full'
})

const emit = defineEmits<Emits>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (value: number | null | undefined) => emit('update:modelValue', value ?? null)
})

const inputClass = computed(() => props.class)
</script>
