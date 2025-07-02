<template>
  <div class="w-full">
    <UFormField :hint="hint && String(hint)" :error="errors.length > 0 ? errors[0] : undefined">
      <template #label>
        <span class="block text-sm text-neutral-600 dark:text-neutral-400">{{ label }}</span>
      </template>
      <template #default>
        <UInput ref="inputRef" :required="props.required" :size="size" class="w-full" />
      </template>
    </UFormField>
  </div>
</template>


<script setup lang="ts">
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
  required: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<'xs' | 'sm' | 'md' | 'lg'>,
    default: 'md',
  },
})

const { inputRef, numberValue, setValue } = useEuroCurrencyInput({ valueRange: { max: props.maxPrice } })

const emit = defineEmits(['update:modelValue'])

watch (numberValue, (newValue) => {
  if (newValue === null) {
    setValue(0)
    emit('update:modelValue', 0)
  } else {
    emit('update:modelValue', newValue)
  }

})
</script>