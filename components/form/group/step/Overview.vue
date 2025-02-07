<template>
  <div class="max-w-3xl mx-auto flex flex-col gap-y-6">
    <div>
      <h2 class="sticky top-0 p-2 -mx-2 backdrop-blur bg-gray-100/80 dark:bg-gray-950/80 font-semibold text-2xl text-gray-900 dark:text-gray-100">Verkäufer:in</h2>
      <div class="grid grid-cols-6 gap-x-2">
        <DataLabel label="Matrikelnummer" :data="modelValue.seller.matriculationNumber" class="col-span-1" />
        <DataLabel label="Name" :data="modelValue.seller.fullName" class="col-span-2" />
        <DataLabel label="E-Mail" :data="modelValue.seller.email" class="col-span-3" />
      </div>
    </div>
    <div>
      <h2 class="sticky z-10 top-0 p-2 -mx-2 backdrop-blur bg-gray-100/80 dark:bg-gray-950/80 font-semibold text-2xl text-gray-900 dark:text-gray-100">Angebotene Bücher</h2>
      <div class="flex flex-col gap-y-3">
        <div v-for="offer in modelValue.offers" :key="offer.id">
          <h3 class="sticky top-12 backdrop-blur bg-gray-100/80 dark:bg-gray-950/80 font-medium text-lg text-gray-800 dark:text-gray-200">{{ offer.book.title }}</h3>
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
        size="sm"
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
const { token } = useAuth()

const buttonLabel = computed(() => {
  return props.modelValue.offers.length === 1 ? 'Angebot anlegen' : 'Angebote anlegen'
})

const submitOffers = async () => {
  const seller_id = props.modelValue.seller.id
  const createOffers: CreateOffer[] = props.modelValue.offers.map(offer => ({
    book_id: offer.book.isbn,
    price: offer.price,
    seller_id: seller_id,
    member_id: 1,
    marked: offer.marked,
    location: offer.location,
  }))

  const response = await fetch(useRuntimeConfig().public.apiUrl + '/offers/bulk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token.value}`,
    },
    body: JSON.stringify(createOffers),
  })

  if (response.ok) {
    useToast().add({
      title: 'Erfolg',
      description: 'Angebot erfolgreich angelegt.',
      icon: 'i-heroicons-check-circle',
      color: 'green',
    })
    
    router.push('/fv/offers')
  } else {
    const data = await response.json()
    console.error('No offers created', data)
    
    useToast().add({
      title: 'Fehler',
      description: data,
      icon: 'i-heroicons-check-circle',
      color: 'red',
    })
  }
}

interface CreateOffer {
  book_id: string
  price: number
  seller_id: number
  member_id: number
  marked: boolean
  location: string
}

interface NewOffers {
  seller: Seller
  offers: Offer[]
}
</script>