<template>
  <div class="w-full max-w-5xl mx-auto flex flex-col gap-y-8">
    <section class="flex flex-row gap-4">
      <div class="w-1/3">
        <div v-if="!seller" class="h-full p-4 flex flex-col items-center justify-center gap-y-2 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700">
          <h2 class="uppercase text-neutral-500 dark:text-neutral-400">Schritt 1</h2>
          <span class="text-neutral-600 dark:text-neutral-300">Verkäufer:in hinzufügen</span>
          <UButton label="Verkäufer:in auswählen" @click="sellerModal = true" />
        </div>
        <div v-else class="flex flex-col gap-y-4 p-4 rounded-lg bg-white">
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
        <div class="p-4 rounded-lg" :class="{ 'border-2 border-dashed border-neutral-300 dark:border-neutral-700': !selectedBook, 'bg-white': selectedBook }">
          <div class="flex flex-col gap-y-2" :class="{ 'items-center': !selectedBook }">
            <h2 v-if="!selectedBook" class="uppercase text-neutral-500 dark:text-neutral-400">Schritt 2</h2>
            <span v-if="!selectedBook" class="text-neutral-600 dark:text-neutral-300">Buch hinzufügen und kontrollieren</span>
            <UButtonGroup class="mx-auto">
              <UInput v-model="isbn" type="text" color="neutral" placeholder="9876543210987" autocomplete="off" :disabled="!seller" @keydown.enter="handleIsbnSubmit" />
              <UButton color="neutral" variant="subtle" icon="i-lucide-search" :disabled="!seller" @click="handleIsbnSubmit" />
            </UButtonGroup>
            <div v-if="selectedBook" class="grid grid-cols-3 gap-2">
              <DataLabel label="Titel" :data="selectedBook.title" class="col-span-3" />
              <DataLabel label="Autoren" :data="selectedBook.authors" class="col-span-3" />
              <DataLabel label="Verlag" :data="selectedBook.publisher" class="col-span-3" />
              <DataLabel label="Prüfung" :data="selectedBook.exam?.name" class="col-span-3" />
              <DataLabel label="ISBN" :data="selectedBook.isbn" />
              <DataLabel label="Auflage" :data="selectedBook.edition" />
              <DataLabel label="Max. Preis" :data="formatPrice(selectedBook.maxPrice)" />
            </div>
          </div>
        </div>
        <div class="relative p-4 rounded-lg" :class="{ 'border-2 border-dashed border-neutral-300 dark:border-neutral-700': !selectedBook, 'bg-white': selectedBook }">
          <div v-if="(!seller || !selectedBook) && (price != 0 || location.length > 0 || marked)" class="absolute top-0 left-0 w-full h-full z-10 backdrop-blur-xs" />
          <div class="flex flex-col gap-y-2" :class="{ 'items-center': !selectedBook }">
            <h2 v-if="!selectedBook" class="uppercase text-neutral-500 dark:text-neutral-400">Schritt 3</h2>
            <span v-if="!selectedBook" class="text-neutral-600 dark:text-neutral-300">Angebotdetails eintragen</span>
            <div v-else>
              <UForm 
                :state="offerFormState"
                class="grid grid-cols-3 gap-4"
                @submit="createOffer(offerFormState.price, offerFormState.marked, offerFormState.location)">
                <UFormField label="Ort" name="location">
                  <UInput v-model="offerFormState.location" />
                </UFormField>

                <UFormField label="Buch Zustand" name="marked">
                  <UCheckbox v-model="offerFormState.marked" label="Beschriftet" />
                </UFormField>

                <UFormField label="Preis" name="price" required>
                  <UInputNumber
                    v-model="offerFormState.price"
                    :min="0"
                    :max="999.99"
                    :step="0.01"
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
      <section class="flex flex-col gap-y-2" :class="{ 'items-center': offers.length === 0 }">
        <template v-if="offers.length === 0">
          <UIcon name="i-lucide-sparkles" class="mt-4 text-neutral-400 w-10 h-10" />
          <span class="text-neutral-600">Es wurden noch keine neuen Angebote erstellt.</span>
        </template>
        <template v-else>
          <OfferBatchOverview v-for="offer in offers" :key="offer.id" :offer="offer" />
        </template>
      </section>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { Book } from '~/interfaces/Book'
import type { Offer } from '~/interfaces/Offer'
import type { Seller } from '~/interfaces/Seller'

useSeoMeta({
  title: 'Statistiken',
})

definePageMeta({
  layout: 'protected',
})

const { token } = useAuth()
const offers = ref<Offer[]>([])
const sellerModal = ref<boolean>(false)
const seller = ref<Seller | null>()
const isbn = ref<string>('')
const loadingIsbn = ref<boolean>(false)
const selectedBook = ref<Book | null>()
const bookModal = ref<boolean>(false)
const price = ref<number>(0)
const location = ref<string>('')
const marked = ref<boolean>(false)

const offerFormState = ref<{price: number, marked: boolean, location: string}>({
  price: 0,
  marked: false,
  location: '',
})

const handleSellerSubmit = (newSeller: Seller) => {
  // Handle seller submission logic here
  console.log('Seller submitted:', seller)
  seller.value = newSeller
  sellerModal.value = false
}

const handleIsbnSubmit = async () => {
  loadingIsbn.value = true

  // Check if the isbn is of length 13 and only contains numbers
  /* const errors = isbnValidators(formState)

  if (errors.length > 0) {
    form.value.setErrors(form.value.errors.concat(errors))
    loadingIsbn.value = false
    return
  } */

  try {
    const singleBook = await $fetch<Book>(useRuntimeConfig().public.apiUrl + `/books/${isbn.value}`, {
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

  //checkedIsbn.value = true
  loadingIsbn.value = false
}

let dummyId = 1011
const createOffer = async (price: number, marked: boolean, location: string) => {
  if (!selectedBook.value || !seller.value) {
    console.error('Selected book or seller is not set')
    return
  }

  const newOffer: Offer = {
    id: dummyId++,
    book: selectedBook.value,
    price: price,
    seller: seller.value,
    member: {
      id: 1,
      username: 'max.mustermann',
      email: 'max@fvjus.at'
    },
    active: true,
    createdAt: new Date(),
    modified: new Date(),
    marked: marked,
    location: location,
  }

  offers.value.unshift(newOffer)
}
</script>