<template>
  <div class="w-full max-w-5xl mx-auto flex flex-col gap-y-4">
    <div class="flex flex-row gap-4">
      <div class="w-1/3">
        <div v-if="!seller" class="h-full p-4 flex flex-col items-center justify-center gap-y-2 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700">
          <h2 class="uppercase text-neutral-500 dark:text-neutral-400">Schritt 1</h2>
          <span class="text-neutral-600 dark:text-neutral-300">Verkäufer:in hinzufügen</span>
          <UButton label="Verkäufer:in auswählen" @click="sellerModal = true" />
        </div>
        <div v-else class="flex flex-col gap-y-4 p-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-800">
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
          <div class="flex flex-col items-center gap-y-2">
            <h2 v-if="!selectedBook" class="uppercase text-neutral-500 dark:text-neutral-400">Schritt 2</h2>
            <span v-if="!selectedBook" class="text-neutral-600 dark:text-neutral-300">Buch hinzufügen und kontrollieren</span>
            <UButtonGroup>
              <UInput v-model="isbn" type="text" color="neutral" placeholder="9876543210987" autocomplete="off" :disabled="!seller" @keydown.enter="handleIsbnSubmit" />
              <UButton color="neutral" variant="subtle" icon="i-lucide-search" :disabled="!seller" @click="handleIsbnSubmit" />
            </UButtonGroup>
            <div v-if="selectedBook">
              <pre>
                {{ selectedBook }}
              </pre>
            </div>
          </div>
        </div>
        <div class="relative p-4 rounded-lg border-2" :class="{ 'border-dashed border-neutral-300 dark:border-neutral-700': !selectedBook, 'border-neutral-200 dark:border-neutral-800': selectedBook }">
          <div v-if="(!seller || !selectedBook) && (price != 0 || location.length > 0 || marked)" class="absolute top-0 left-0 w-full h-full z-10 backdrop-blur-md"></div>
          <div class="flex flex-col gap-y-2" :class="{ 'items-center': !selectedBook }">
            <h2 v-if="!selectedBook" class="uppercase text-neutral-500 dark:text-neutral-400">Schritt 3</h2>
            <span v-if="!selectedBook" class="text-neutral-600 dark:text-neutral-300">Angebotdetails eintragen</span>
            <div v-else>
              <UInput
                v-model.number="price"
                type="number"
                color="neutral"
                placeholder="Preis in Euro"
                :disabled="!selectedBook || !seller"
              />
              <UInput
                v-model="location"
                type="text"
                color="neutral"
                placeholder="Ort (z.B. Reg1)"
                :disabled="!selectedBook || !seller"
              />
              <UCheckbox v-model="marked" label="Markiert" :disabled="!selectedBook || !seller" />
              <UButton
                label="Angebot erstellen"
                color="primary"
                :disabled="!selectedBook || !seller"
                @click="createOffer(price, marked, location)"
              />
            </div>
          </div>
        </div>
      </div>
      <UModal v-model:open="bookModal" title="Verkäuferin auswählen">
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
    </div>
    <div class="flex flex-row justify-between">
      <h1 class="text-2xl">Verlauf</h1>
      <UButton label="Verkäufer auswählen" />
    </div>
    <section class="flex flex-col gap-y-4">
      <OfferBatchOverview v-for="offer in offers" :key="offer.id" :offer="offer" />
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { Book } from '~/interfaces/Book';
import type { Offer } from '~/interfaces/Offer';
import type { Seller } from '~/interfaces/Seller';

useSeoMeta({
  title: 'Statistiken',
})

definePageMeta({
  layout: 'protected',
})

const { token } = useAuth();
const offers = ref<Offer[]>([
  {
    id: 1010,
    book: {
      isbn: '978-3-16-148410-0',
      title: 'Rechtsgeschichte und Römisches Recht Studienwörterbuch inkl. einem sehr langen weiteren Titel der bestimmt nicht in eine Zeile passt',
      authors: 'Max Mustermann, Maria Musterfrau, Vorname von Nachname',
      publisher: 'Verlagshaus Musterverlag',
      edition: '12',
      maxPrice: 129.99,
      exam: {
        id: 1,
        name: 'Prüfung 1',
      },
    },
    seller: {
      id: 1,
      fullName: 'Max Mustermann',
      matriculationNumber: '12123456',
      email: 'user@email.com'
    },
    price: 25.00,
    createdAt: new Date(),
    modified: new Date(),
    active: true,
    member: {
      id: 1,
      username: 'max.mustermann',
      email: 'max@fvjus.at'
    },
    marked: false,
    location: 'Reg1'
  }
])
const sellerModal = ref<boolean>(false);
const seller = ref<Seller | null>();
const isbn = ref<string>('');
const loadingIsbn = ref<boolean>(false);
const selectedBook = ref<Book | null>();
const bookModal = ref<boolean>(false);
const price = ref<number>(0);
const location = ref<string>('');
const marked = ref<boolean>(false);

const handleSellerSubmit = (newSeller: Seller) => {
  // Handle seller submission logic here
  console.log('Seller submitted:', seller);
  seller.value = newSeller;
  sellerModal.value = false;
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

let dummyId = 1011;
const createOffer = async (price: number, marked: boolean, location: string) => {
  if (!selectedBook.value || !seller.value) {
    console.error('Selected book or seller is not set');
    return;
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

  offers.value.unshift(newOffer);
}
</script>