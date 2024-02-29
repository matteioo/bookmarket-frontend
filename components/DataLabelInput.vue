<template>
  <div class="w-full">
    <span class="block text-sm text-gray-600 dark:text-gray-400">{{ label }}</span>
    <UInput v-if="(typeof modelValue !== 'boolean')" size="xs" :model-value="modelValue" @update:modelValue="updateModelValue" />
    <UToggle v-else class="mt-1" :model-value="modelValue" @update:modelValue="updateModelValue" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: '-',
  },
});

const emit = defineEmits(['update:modelValue']);

const updateModelValue = (newValue: any) => {
  emit('update:modelValue', newValue);
};
</script>