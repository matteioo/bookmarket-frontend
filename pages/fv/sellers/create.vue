<template>
  <div class="flex-grow w-full max-w-sm mx-auto flex items-center justify-center">
    <FormGroupSeller to="/fv/sellers" :on-submit="createSeller" />
  </div>
</template>

<script setup lang="ts">
import type { Seller } from '~/interfaces/Seller';

useSeoMeta({
  title: 'Verkäufer:in anlegen',
});

definePageMeta({
  layout: 'protected',
});

async function createSeller(event: Seller) {
  console.log('createSeller', event);
};
</script>