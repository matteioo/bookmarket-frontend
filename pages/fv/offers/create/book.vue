<template>
  <div class="flex-grow w-full flex items-center justify-center">
    <div class="w-full max-w-sm">
      <FormGroupBook :onSubmit="createBook" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/interfaces/Book';

definePageMeta({
  middleware: 'auth',
  layout: 'protected',
});

const router = useRouter();

async function createBook(event: Book) {
  if (event) {
    router.push('/fv/offers');
  }
};
</script>