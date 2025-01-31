<template>
  <div class="w-full">
    <UFormGroup :hint="hint && String(hint)" :error="errors.length > 0 ? errors[0] : undefined">
      <template #label>
        <span class="block text-sm text-gray-600 dark:text-gray-400">{{ label }}</span>
      </template>
      <template #default>
        <UInput v-if="(typeof modelValue !== 'boolean')" size="xs" :model-value="modelValue" @update:model-value="updateModelValue" />
        <UToggle v-else class="mt-1" :model-value="modelValue" @update:model-value="updateModelValue" />
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
    type: [String, Number, Boolean],
    default: '-',
  },
  errors: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  hint: {
    type: String,
    default: undefined,
  },
});

const emit = defineEmits(['update:modelValue']);

const updateModelValue = (newValue: never) => {
  emit('update:modelValue', newValue);
};
</script>