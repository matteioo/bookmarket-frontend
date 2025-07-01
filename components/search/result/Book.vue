<template>
  <div class="p-2 flex flex-col gap-y-1 rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-900">
    <div>
      <h2 class="truncate font-semibold text-neutral-700 dark:text-neutral-300">{{ book.title }}</h2>
    </div>
    <div class="text-neutral-600 dark:text-neutral-400">
      <div class="inline-flex items-center gap-x-1"><UIcon name="i-heroicons-users-solid" class="w-5 h-5" /> {{ book.authors }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/interfaces/Book'

const _props = defineProps({
  book: {
    type: Object as () => Book,
    required: true,
  },
})
</script>