<template>
  <div class="max-h-[80vh] overflow-y-scroll">
    <div class="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-300 dark:before:from-gray-700 before:to-gray-300">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Member } from '~/interfaces/Member';

const _member = ref<Member>({
  id: 1,
  username: 'max.mustermann',
  email: '',
});

const _dateTime = ref<Date>(new Date('2024-04-17T03:24:12'));
</script>