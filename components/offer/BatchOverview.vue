<template>
  <div class="w-full">
    <div class="flex flex-row overflow-clip rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
      <div class="p-4 flex flex-col items-center gap-1 bg-neutral-50 dark:bg-black">
        <div class="text-neutral-500">Nummer</div>
        <div class="grow text-xl font-semibold text-primary-700 dark:text-primary-400">#{{ props.offer.id }}</div>
      </div>
      <div class="grow p-4 flex flex-col gap-y-4">
        <h2 class="font-semibold line-clamp-2">{{ props.offer.book.title }}</h2>
        <div class="flex justify-between text-neutral-600 dark:text-neutral-300">
          <div>{{ props.offer.seller.fullName }} &middot; {{ props.offer.seller.matriculationNumber }}</div>
          <div v-if="props.offer.location.trim().length > 0">Ort: {{ props.offer.location }}</div>
          <div>Markiert: {{ props.offer.marked ? 'Ja' : 'Nein' }}</div>
          <div>{{ formatPrice(props.offer.price) }}</div>
        </div>
      </div>
      <div class="">
        <UButton
          variant="ghost"
          icon="i-lucide-clipboard-check"
          class="rounded-none h-full"
        />
      </div>
    </div>
    <div class="w-full px-4">
      <div class="flex flex-col overflow-hidden rounded-b border-x border-b border-sky-200 dark:border-sky-900">
        <UCollapsible v-model:open="showDetails" class="flex flex-col gap-2">
          <template #content>
            <div class="dark:bg-black">
              <div class="w-full p-2 grid grid-cols-6">
                <DataLabel label="Autoren" :data="props.offer.book.authors" class="col-span-6" />
                <DataLabel label="Verlag" :data="props.offer.book.publisher" class="col-span-3" />
                <DataLabel label="Prüfung" :data="props.offer.book.exam?.name" class="col-span-3" />
                <DataLabel label="ISBN" :data="props.offer.book.isbn" class="col-span-3" />
                <DataLabel label="Auflage" :data="props.offer.book.edition" class="col-span-2" />
                <DataLabel label="Max. Preis" :data="formatPrice(props.offer.book.maxPrice)" />
              </div>
              <USeparator class="p-2" />
              <div class="w-full p-2 grid grid-cols-3">
                <DataLabel label="Vollständiger Name" :data="props.offer.seller.fullName" class="col-span-2" />
                <DataLabel label="Matrikelnummer" :data="props.offer.seller.matriculationNumber" />
                <DataLabel label="E-Mail" :data="props.offer.seller.email" class="col-span-3" />
                <DataLabel v-if="props.offer.seller.note" label="Notiz" :data="props.offer.seller.note" :multi-line="true" />
              </div>
            </div>
          </template>
        </UCollapsible>
        <div class="p-2 flex flex-row justify-center gap-2 items-center cursor-help text-sm text-sky-800 dark:text-sky-200 bg-sky-50 dark:bg-sky-950" @click="showDetails = !showDetails">
          Details {{ showDetails ? 'ausblenden' : 'anzeigen' }} <UIcon name="i-lucide-info" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatPrice } from '#imports'
import type { Offer } from '~/interfaces/Offer'

const props = defineProps({
  offer: {
    type: Object as PropType<Offer>,
    required: true
  }
})

const showDetails = ref(false)
</script>