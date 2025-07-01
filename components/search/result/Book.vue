<template>
  <div class="p-2 flex flex-col gap-y-1 rounded hover:bg-gray-200 dark:hover:bg-gray-900">
    <div>
      <h2 class="truncate font-semibold text-gray-700 dark:text-gray-300">{{ book.title }}</h2>
    </div>
    <div class="text-gray-600 dark:text-gray-400">
      <div class="inline-flex items-center gap-x-1"><UIcon name="i-heroicons-users-solid" class="w-5 h-5" /> {{ book.authors }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/interfaces/Book';

const _props = defineProps({
  book: {
    type: Object as () => Book,
    required: true,
  },
});
</script>