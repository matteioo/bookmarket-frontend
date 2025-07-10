<template>
  <div class="w-full">
    <span class="block text-sm text-neutral-600 dark:text-neutral-400">{{ props.label }}</span>
    <span class="block text-neutral-700 dark:text-neutral-300" :class="{ 'whitespace-pre-line': props.multiLine, 'truncate': props.truncate }">{{ props.data || '-' }}</span>
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
  truncate: {
    type: Boolean,
    default: true,
  },
})
</script>