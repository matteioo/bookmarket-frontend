<template>
  <div class="w-full">
    <span class="block text-sm text-neutral-600 dark:text-neutral-400">{{ props.label }}</span>
    <span class="block text-neutral-700 dark:text-neutral-300">
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
})
</script>