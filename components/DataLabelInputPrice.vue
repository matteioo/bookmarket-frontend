<template>
  <div class="w-full">
    <UFormGroup :hint="hint && String(hint)" :error="errors.length > 0 ? errors[0] : undefined">
      <template #label>
        <span class="block text-sm text-gray-600 dark:text-gray-400">{{ label }}</span>
      </template>
      <template #default>
        <UInput ref="inputRef" size="xs" />
      </template>
    </UFormGroup>
  </div>
</template>


<script setup lang="ts">
const _props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [Number],
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
  }
});

const { inputRef, numberValue } = useEuroCurrencyInput({ valueRange: { max: _props.maxPrice } })

const emit = defineEmits(['update:modelValue']);

watch (numberValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>