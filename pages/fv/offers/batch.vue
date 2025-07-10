<template>
  <div class="w-full max-w-5xl mx-auto flex flex-col gap-y-8">
    <section class="flex flex-row gap-4">
      <div class="w-1/3">
        <div v-if="!seller" class="h-full p-4 flex flex-col items-center justify-center gap-y-2 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700">
          <h2 class="uppercase text-neutral-500 dark:text-neutral-400">Schritt 1</h2>
          <span class="text-neutral-600 dark:text-neutral-300">Verkäufer:in hinzufügen</span>
          <UButton label="Verkäufer:in auswählen" @click="sellerModal = true" />
        </div>
        <div v-else class="flex flex-col gap-y-4 p-4 rounded-lg bg-white dark:bg-black dark:border-2 dark:border-neutral-900">
          <h2 class="w-full text-center">Verkäufer:in</h2>
          <div>
            <DataLabel label="Name" :data="seller.fullName" />
            <DataLabel label="Matrikelnummer" :data="seller.matriculationNumber" />
            <DataLabel label="E-Mail" :data="seller.email" />
          </div>
          <div class="flex flex-row-reverse gap-x-2">
            <UButton
              label="Verkäufer:in ändern"
              color="primary"
              variant="outline"
              @click="sellerModal = true"
            />
            <UButton
              label="Zurücksetzen"
              color="primary"
              variant="ghost"
              @click="seller = null"
            />
          </div>
        </div>
        <UModal v-model:open="sellerModal" title="Verkäuferin auswählen">
          <template #body>
            <FormGroupStepSeller :on-submit="handleSellerSubmit" />
          </template>
        </UModal>
      </div>
      <div class="flex flex-col gap-y-4 w-2/3">
        <div class="p-4 rounded-lg" :class="{ 'border-2 border-dashed border-neutral-300 dark:border-neutral-700': !selectedBook, 'bg-white dark:bg-black dark:border-2 dark:border-neutral-900': selectedBook }">
          <div class="flex flex-col gap-y-2" :class="{ 'items-center': !selectedBook }">
            <h2 v-if="!selectedBook" class="uppercase text-neutral-500 dark:text-neutral-400">Schritt 2</h2>
            <span v-if="!selectedBook" class="text-neutral-600 dark:text-neutral-300">Buch hinzufügen und kontrollieren</span>
            <UForm
              :state="isbnFormState"
              :validate="isbnValidators"
              class="mx-auto"
              @submit="handleIsbnSubmit"
            >
              <UFormField label="ISBN" name="isbn">
                <UButtonGroup>
                  <UInput v-model="isbnFormState.isbn" type="text" color="primary" placeholder="9876543210987" autocomplete="off" :disabled="!seller" />
                  <UButton type="submit" color="neutral" variant="subtle" icon="i-lucide-search" :loading="loadingIsbn" :disabled="!seller" />
                </UButtonGroup>
              </UFormField>
            </UForm>
            <div v-if="selectedBook" class="grid grid-cols-3 gap-2">
              <DataLabel label="Titel" :data="selectedBook.title" class="col-span-3" />
              <DataLabel label="Autoren" :data="selectedBook.authors" class="col-span-3" />
              <DataLabel label="Verlag" :data="selectedBook.publisher" class="col-span-3" />
              <DataLabel label="Prüfung" :data="selectedBook.exam?.name" class="col-span-3" />
              <DataLabel label="ISBN" :data="selectedBook.isbn" />
              <DataLabel label="Auflage" :data="String(selectedBook.edition)" />
              <DataLabel label="Max. Preis" :data="formatPrice(selectedBook.maxPrice)" />
            </div>
          </div>
        </div>
        <div class="relative p-4 rounded-lg" :class="{ 'border-2 border-dashed border-neutral-300 dark:border-neutral-700': !selectedBook, 'bg-white dark:bg-black dark:border-2 dark:border-neutral-900': selectedBook }">
          <div v-if="(!seller || !selectedBook) && (price != 0 || location.length > 0 || marked)" class="absolute top-0 left-0 w-full h-full z-10 backdrop-blur-xs" />
          <div class="flex flex-col gap-y-2" :class="{ 'items-center': !selectedBook }">
            <h2 v-if="!selectedBook" class="uppercase text-neutral-500 dark:text-neutral-400">Schritt 3</h2>
            <span v-if="!selectedBook" class="text-neutral-600 dark:text-neutral-300">Angebotdetails eintragen</span>
            <div v-else>
              <UForm
                :state="offerFormState"
                class="grid grid-cols-3 gap-4"
                @submit="createOffer">
                <UFormField label="Ort" name="location">
                  <UInput v-model="offerFormState.location" />
                </UFormField>

                <UFormField label="Buch Zustand" name="marked">
                  <UCheckbox v-model="offerFormState.marked" label="Beschriftet" />
                </UFormField>

                <UFormField label="Preis" name="price">
                  <UInputNumber
                    v-model="offerFormState.price"
                    :min="0"
                    :max="999"
                    :format-options="{
                      style: 'currency',
                      currency: 'EUR',
                      currencyDisplay: 'symbol',
                      currencySign: 'accounting'
                    }"
                  />
                </UFormField>
                
                <div class="col-span-3 flex flex-row justify-end">
                  <UButton
                    label="Erstellen"
                    color="primary"
                    variant="solid"
                    type="submit"
                  />
                </div>
              </UForm>
            </div>
          </div>
        </div>
      </div>
      <UModal v-model:open="bookModal" title="Buch auswählen">
        <template #body>
          <UAlert
            color="warning"
            variant="subtle"
            description="Das Buch mit der gesuchten ISBN ist wahrscheinlich bereits eine veraltete Auflage!"
            icon="i-lucide-book-dashed"
            class="mb-4"
          />
        </template>
      </UModal>
    </section>
    <section class="flex flex-col gap-y-4">
      <div class="flex flex-row justify-center">
        <h1 class="text-2xl">Verlauf</h1>
      </div>
      <section class="flex flex-col gap-y-2" :class="{ 'items-center': addedOffers.length === 0 }">
        <template v-if="addedOffers.length === 0">
          <UIcon name="i-lucide-sparkles" class="mt-4 text-neutral-400 w-10 h-10" />
          <span class="text-neutral-600">Es wurden noch keine neuen Angebote erstellt.</span>
        </template>
        <template v-else>
          <OfferBatchOverview v-for="offer in addedOffers" :key="offer.id" :offer="offer" />
        </template>
      </section>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import type { Book } from '~/interfaces/Book'
import type { Offer } from '~/interfaces/Offer'
import type { Seller } from '~/interfaces/Seller'

useSeoMeta({
  title: 'Angebote anlegen',
})

definePageMeta({
  layout: 'protected',
})

type IsbnFormType = {
  isbn: string
}
type OfferFormType = {
  price: number
  marked: boolean
  location: string
}

const { token } = useAuth()
const addedOffers = ref<Offer[]>([])
const sellerModal = ref<boolean>(false)
const seller = ref<Seller | null>()
const loadingIsbn = ref<boolean>(false)
const selectedBook = ref<Book | null>()
const bookModal = ref<boolean>(false)
const price = ref<number>(0)
const location = ref<string>('')
const marked = ref<boolean>(false)

const isbnFormState = ref<IsbnFormType>({
  isbn: '',
})
const offerFormState = ref<OfferFormType>({
  price: 0,
  marked: false,
  location: '',
})

const handleSellerSubmit = (newSeller: Seller) => {
  seller.value = newSeller
  sellerModal.value = false
}

const isbnValidators = (state: IsbnFormType): FormError[] => {
  const errors = []

  if (state.isbn && !/^\d+$/.test(state.isbn)) errors.push({ name: 'isbn', message: 'ISBN darf nur Ziffern enthalten' })
  if (state.isbn && state.isbn.toString().length !== 13) errors.push({ name: 'isbn', message: 'ISBN muss aus genau 13 Ziffern bestehen' })

  return errors
}

const handleIsbnSubmit = async (event: FormSubmitEvent<IsbnFormType>) => {
  loadingIsbn.value = true

  try {
    const singleBook = await $fetch<Book>(useRuntimeConfig().public.apiUrl + `/books/${event.data.isbn}`, {
      headers: {
        Authorization: `${token.value}`,
      },
    })

    if (singleBook) {
      selectedBook.value = singleBook
    } else {
      selectedBook.value = null
      console.error('No book found')
    }
  } catch (error) {
    selectedBook.value = null
    console.error('Error while fetching book', error)
  }

  if (!selectedBook.value) {
    bookModal.value = true
  }

  loadingIsbn.value = false
}

const createOffer = async (event: FormSubmitEvent<OfferFormType>) => {
  if (!selectedBook.value || !seller.value) {
    console.error('Selected book or seller is not set')
    return
  }

  const response = await fetch(useRuntimeConfig().public.apiUrl + '/offers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token.value}`,
    },
    body: JSON.stringify({
      book_id: selectedBook.value.isbn,
      seller_id: seller.value.id,
      price: event.data.price,
      marked: event.data.marked,
      location: event.data.location,
    }),
  })

  if (response.ok) {
    useToast().add({
      title: 'Erfolg',
      description: 'Angebot erfolgreich angelegt.',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })
    const createdOffer = await response.json()
    addedOffers.value.unshift(createdOffer)
  } else {
    const data = await response.json()
    console.error('No offers created', data)
    
    useToast().add({
      title: 'Fehler',
      description: data,
      icon: 'i-heroicons-check-circle',
      color: 'error',
    })
  }
}
</script>