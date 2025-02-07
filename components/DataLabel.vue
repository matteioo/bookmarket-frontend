<template>
  <div class="w-full">
    <span class="block text-sm text-gray-600 dark:text-gray-400">{{ props.label }}</span>
    <span class="block truncate text-gray-700 dark:text-gray-300" :class="{ 'whitespace-pre-line': props.multiLine }">{{ props.data || '-' }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    default: '-',
  },
  multiLine: {
    type: Boolean,
    default: false,
  },
})
</script>