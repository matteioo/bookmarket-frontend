<template>
  <div class="w-fit flex flex-row items-center gap-x-2 rounded hover:bg-gray-200 dark:hover:bg-gray-900">
    <div class="p-2 flex-1">
      <h2 class="truncate font-semibold text-gray-700 dark:text-gray-300">{{ offer.book.title }}</h2>
      <div class="text-gray-600 dark:text-gray-400">
        <div class="flex items-center gap-x-1"><UIcon name="i-heroicons-users-solid" class="w-5 h-5" /><span class="truncate">{{ offer.book.authors }}</span></div>
      </div>
    </div>
    <div>
      Preisabc
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPrice } from '~/utils/utils';
import type { Offer } from '~/interfaces/Offer';

const props = defineProps({
  offer: {
    type: Object as () => Offer,
    required: true,
  },
});
</script>