<template>
  <div class="w-full">
    <UFormField :hint="hint" :error="errors[0]">
      <template #label>
        <span class="block text-sm text-neutral-600 dark:text-neutral-400">{{ label }}</span>
      </template>
      <UInputNumber
        v-model="model"
        class="w-full"
        :size="size"
        :min="0"
        :max="maxPrice"
        :format-options="{
          style: 'currency',
          currency: 'EUR',
          currencyDisplay: 'symbol',
          currencySign: 'accounting',
          maximumFractionDigits: 0,
        }"
      />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
const _props = defineProps({
  label: {
    type: String,
    required: true,
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
    default: 999,
  },
  size: {
    type: String as PropType<'xs' | 'sm' | 'md' | 'lg'>,
    default: 'md',
  },
})

const model = defineModel<number>()
</script>