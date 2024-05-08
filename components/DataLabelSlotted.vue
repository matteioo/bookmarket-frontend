<template>
  <div class="w-full">
    <span class="block text-sm text-gray-600 dark:text-gray-400">{{ props.label }}</span>
    <span class="block text-gray-700 dark:text-gray-300">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>