<template>
  <div class="w-full p-2 flex flex-row items-center gap-x-2 cursor-pointer rounded hover:bg-gray-200 dark:hover:bg-gray-900" @click="modalOpen = true">
    <div class="flex-auto overflow-x-hidden">
      <div class="text-gray-700 dark:text-gray-300">
        <div class="flex items-center gap-x-1">
          <UTooltip v-if="!offer.active" text="Verkauft oder Inaktiv">
            <UIcon name="i-heroicons-eye-slash-solid" class="w-4 h-4 flex-shrink-0 text-primary-600 dark:text-primary-400" mode="svg" />
          </UTooltip>
          <h2 class="flex-shrink truncate" :class="{ 'italic': !offer.active, 'font-semibold': offer.active }">{{ offer.book.title }}</h2>
          <UTooltip v-if="offer.marked" text="Markiert oder Beschrieben">
            <UIcon name="i-heroicons-paint-brush-solid" class="w-4 h-4 flex-shrink-0 text-sky-600 dark:text-sky-400" mode="svg" />
          </UTooltip>
        </div>
      </div>
      <div class="text-gray-600 dark:text-gray-400">
        <div class="flex items-center gap-x-1">
          <UIcon name="i-heroicons-users-solid" class="w-4 h-4 flex-shrink-0" />
          <div class="flex-auto truncate">{{ offer.book.authors }}</div>
        </div>
      </div>
    </div>
    <div class="flex-shrink-0">
      {{ formatPrice(offer.price) }}
    </div>
  </div>

  <UModal v-model="modalOpen" :ui="{width: 'sm:max-w-xl md:max-w-2xl lg:max-w-4xl'}">
    <div class="p-4 grid grid-cols-6">
      <h2 class="mb-2 col-span-6 block font-semibold text-gray-800 dark:text-gray-200">{{ offer.book.title }}</h2>
      <DataLabel class="col-span-6" label="Autoren" :multi-line="true" :data="offer.book.authors" />
      <DataLabel class="col-span-1" label="Auflage" :data="String(offer.book.edition)" />
      <DataLabel class="col-span-3" label="Verlag" :data="offer.book.publisher" />
      <DataLabel class="col-span-2" label="ISBN" :data="offer.book.isbn" />
      <DataLabel label="Prüfung" :data="offer.book.exam?.name" />
      <UDivider class="col-span-6 py-2" label="Angebotdetails" />
      <DataLabel class="col-span-1" label="Angebots-ID" :data="String(offer.id)" />
      <DataLabel class="col-span-1" label="Markiert" :data="offer.marked ? 'Ja' : 'Nein'" />
      <DataLabel class="col-span-1" label="Ort" :data="offer.location" />
      <DataLabelSlotted class="col-span-3" label="Verkäufer">
        <ULink
          :to="`/fv/sellers/${offer.seller.id}`"
          class="inline-flex flex-row gap-x-1 items-center text-gray-700 dark:text-gray-300 hover:text-gray-600 hover:dark:text-gray-400"
        >
          <span>{{ offer.seller.fullName }}</span>
          <UIcon name="i-heroicons-arrow-top-right-on-square-solid" class="w-5 h-5 flex-shrink-0" />
        </ULink>
      </DataLabelSlotted>
    </div>
    <div class="p-4 flex flex-row items-center justify-between text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950">
      <span>Preis: <b>{{ formatPrice(offer.price) }}</b> (max. {{ formatPrice(offer.book.maxPrice) }})</span>
      <div v-if="offer.active" class="inline-flex flex-row gap-x-2">
        <UButton label="Buch verkaufen" icon="i-heroicons-banknotes" :to="`/fv/sell/${offer.id}`" />
      </div>
      <div v-else class="inline-flex flex-row items-center gap-x-1">
        <UIcon name="i-heroicons-no-symbol-solid" class="w-5 h-5 flex-shrink-0" />
        <i>Angebot inaktiv!</i>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { formatPrice } from '~/utils/utils';
import type { Offer } from '~/interfaces/Offer';

const _props = defineProps({
  offer: {
    type: Object as () => Offer,
    required: true,
  },
});

const modalOpen = ref(false);
</script>