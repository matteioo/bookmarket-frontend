<template>
  <div class="grow w-full flex items-center justify-center">
    <div class="w-full max-w-sm">
      <FormGroupBook :on-submit="createBook" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/interfaces/Book'

useSeoMeta({
  title: 'Buch hinzufügen',
})

definePageMeta({
  layout: 'protected',
})

const router = useRouter()

async function createBook(event: Book) {
  if (event) {
    router.push('/fv/offers')
  }
}
</script>