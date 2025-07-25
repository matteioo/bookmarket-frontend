<template>
  <div class="max-w-3xl mx-auto flex flex-col gap-y-6">
    <div>
      <h2 class="sticky top-0 p-2 -mx-2 backdrop-blur-sm bg-neutral-100/80 dark:bg-neutral-950/80 font-semibold text-2xl text-neutral-900 dark:text-neutral-100">Verkäufer:in</h2>
      <div class="grid grid-cols-6 gap-x-2">
        <DataLabel label="Matrikelnummer" :data="modelValue.seller.matriculationNumber" class="col-span-1" />
        <DataLabel label="Name" :data="modelValue.seller.fullName" class="col-span-2" />
        <DataLabel label="E-Mail" :data="modelValue.seller.email" class="col-span-3" />
      </div>
    </div>
    <div>
      <h2 class="sticky z-10 top-0 p-2 -mx-2 backdrop-blur-sm bg-neutral-100/80 dark:bg-neutral-950/80 font-semibold text-2xl text-neutral-900 dark:text-neutral-100">Angebotene Bücher</h2>
      <div class="flex flex-col gap-y-3">
        <div v-for="offer in modelValue.offers" :key="offer.id">
          <h3 class="sticky top-12 backdrop-blur-sm bg-neutral-100/80 dark:bg-neutral-950/80 font-medium text-lg text-neutral-800 dark:text-neutral-200">{{ offer.book.title }}</h3>
          <div class="grid grid-cols-12 gap-x-2 gap-y-1">
            <DataLabel label="ISBN" :data="offer.book.isbn" class="col-span-2" />
            <DataLabel label="Autor:innen" :data="offer.book.authors" class="col-span-5" />
            <DataLabel label="Verlag" :data="offer.book.publisher" class="col-span-5" />
            <DataLabel label="Auflage" :data="String(offer.book.edition)" class="col-span-1" />
            <DataLabel label="Markiert" :data="String(offer.marked)" class="col-span-1" />
            <DataLabel label="Prüfung" :data="offer.book.exam?.name" class="col-span-6" />
            <DataLabel label="Lagerort" :data="offer.location !== '' ? offer.location : undefined" class="col-span-2" />
            <DataLabel label="Wunschpreis" :data="formatPrice(offer.price)" class="col-span-2" />
          </div>
        </div>
      </div>
    </div>
    <div class="w-full">
      <UButton
        icon="i-heroicons-rectangle-stack"
        color="primary"
        variant="solid"
        :label="buttonLabel"
        class="float-right"
        @click="submitOffers"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Offer } from '~/interfaces/Offer'
import type { Seller } from '~/interfaces/Seller'

const props = defineProps({
  modelValue: {
    type: Object as PropType<NewOffers>,
    required: true,
  },
})

const router = useRouter()
const { $api } = useNuxtApp()

const buttonLabel = computed(() => {
  return props.modelValue.offers.length === 1 ? 'Angebot anlegen' : 'Angebote anlegen'
})

const submitOffers = async () => {
  const seller_id = props.modelValue.seller.id
  const createOffers: CreateOffer[] = props.modelValue.offers.map(offer => ({
    book_id: offer.book.isbn,
    seller_id: seller_id,
    price: offer.price,
    marked: offer.marked,
    location: offer.location,
  }))

  await $api('/offers/bulk', {
    method: 'POST',
    body: createOffers,
    onResponseError: () => {
      useToast().add({
        title: 'Fehler',
        description: 'Angebote konnten nicht angelegt werden.',
        icon: 'i-heroicons-x-circle',
        color: 'error',
      })
    }
  })

  useToast().add({
    title: 'Erfolg',
    description: 'Angebote erfolgreich angelegt.',
    icon: 'i-heroicons-check-circle',
    color: 'success',
  })
  router.push('/fv/offers')
}

interface CreateOffer {
  book_id: string
  price: number
  seller_id: number
  marked: boolean
  location: string
}

interface NewOffers {
  seller: Seller
  offers: Offer[]
}
</script>