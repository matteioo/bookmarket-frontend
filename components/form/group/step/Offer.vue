<template>
  <div class="flex flex-row gap-x-8">
    <!-- left side -->
    <div class="shrink-0 w-96">
      <div class="sticky h-fit top-4">
        <UForm ref="form" :validate="formValidate" :state="formState" class="w-full space-y-4" @submit="onBookCreate">
          <UFormField label="ISBN" name="isbn" required>
            <UButtonGroup orientation="horizontal" class="w-full">
              <UInput v-model="formState.isbn" type="text" placeholder="9876543210987" class="w-full" autocomplete="off" @keydown.enter.prevent="handleIsbnSearch" />
              <UButton :loading="loadingIsbn" icon="i-heroicons-magnifying-glass" color="neutral" variant="subtle" @click="handleIsbnSearch" />
            </UButtonGroup>
          </UFormField>

          <UFormField v-if="!selected && checkedIsbn" label="Titel" name="title" required>
            <UInput v-model="formState.title" type="text" class="w-full" placeholder="Beispielbuch" />
          </UFormField>

          <UFormField v-if="!selected && checkedIsbn" label="Autoren" name="authors" required>
            <UInput v-model="formState.authors" type="text" class="w-full" placeholder="Vorname Nachname, Vorname Nachname, ..." />
          </UFormField>

          <UFormField v-if="!selected && checkedIsbn" label="Verlag" name="publisher" class="w-full" required>
            <UInput v-model="formState.publisher" type="text" class="w-full" placeholder="FVJus Verlag" />
          </UFormField>

          <div v-if="!selected && checkedIsbn" class="inline-flex flex-row gap-x-2">
            <UFormField label="Auflage" name="edition" required>
              <UInput v-model="formState.edition" type="text" class="w-full" placeholder="14" />
            </UFormField>
            
            <UFormField label="Max. Preis" name="maxPrice" required>
              <UInputNumber
                v-model="formState.maxPrice"
                class="w-full"
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
          </div>

          <UFormField v-if="!selected && checkedIsbn" label="Prüfung" name="exam_id">
            <USelect v-model="formState.exam_id" :items="exams" label-key="name" value-key="id" placeholder="Prüfung auswählen" class="w-full" />
          </UFormField>

          <div v-if="!selected && checkedIsbn" class="w-full mt-2 flex flex-row justify-end gap-x-2">
            <UButton color="primary" variant="link" label="Zurücksetzen" @click="clearForm()" />
            <UButton type="submit" class="float-right" :loading="loading" variant="outline" label="Hinzufügen" />
          </div>
        </UForm>
  
        <div v-if="selected && checkedIsbn" class="w-full mt-4">
          <div class="grid grid-cols-6 gap-2">
            <DataLabel label="Titel" :truncate="false" :data="selected.title" class="col-span-6" />
            <DataLabel label="ISBN" :data="selected.isbn" class="col-span-3" />
            <DataLabel label="Auflage" :data="String(selected.edition)" class="col-span-1" />
            <DataLabel label="Max. Preis" :data="formatPrice(selected.maxPrice)" class="col-span-2" />
            <DataLabel label="Zugehörige Prüfung" :data="selected.exam?.name" class="col-span-6" />
            <DataLabel label="Autoren" :truncate="false" :data="selected.authors" class="col-span-6" />
            <DataLabel label="Verlag" :truncate="false" :data="selected.publisher" class="col-span-6" />
          </div>
          <div class="w-full mt-2 flex flex-row justify-end gap-x-2">
            <UButton
              color="primary"
              variant="outline"
              label="Hinzufügen"
              :disabled="!selected"
              @click="createOffer(selected)"
            />
          </div>
        </div>
        <div v-if="bookPriceBins" class="flex flex-col gap-y-4 mt-4 p-2 rounded-sm bg-white dark:bg-neutral-900">
          <div class="w-full text-center text-neutral-600 dark:text-neutral-300">ISBN: {{ bookPriceBins.book.isbn }}</div>
          <div class="h-32">
            <ClientOnly>
              <ChartPriceBars :bins="bookPriceBins.priceBins" />
              <template #fallback>
                <div class="flex items-center justify-center h-full">
                  <USkeleton class="h-full w-full" />
                </div>
              </template>
            </ClientOnly>
          </div>
          <div class="flex flex-col gap-y-1">
            <div class="flex flex-row justify-between text-neutral-600 dark:text-neutral-400">
              <span>Offene Angebote: {{ bookPriceBins.offerStats.totalCount.active }}</span>
              <span>Verkaufte Bücher: {{ bookPriceBins.offerStats.totalCount.inactive }}</span>
            </div>
            <div class="flex flex-row justify-between text-neutral-600 dark:text-neutral-400">
              <span>Durchschnittlicher Preis: {{ formatPrice(bookPriceBins.offerStats.averagePrice) }}</span>
              <span>Median: {{ formatPrice(bookPriceBins.offerStats.medianPrice) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- right side -->
    <div class="grow">
      <div v-if="offers.length !== 0" class="flex grow flex-col gap-y-4">
        <div v-for="(offer, index) in offers" :key="offer.id">
          <CheckoutOfferItemCreate
            v-model="offers[index]"
            :current-price-bins-isbn="currentPriceBinsIsbn"
            @fetch-price-bins="fetchPriceBins"
            @delete-item="handleDeleteItem"
            @update:has-errors="(newValue: boolean) => offerErrors = newValue"
          />
        </div>
        <div class="w-full py-4 inline-flex flex-row justify-end backdrop-blur-md">
          <UButton label="Weiter" :disabled="offerErrors" @click="handleSubmitOffers" />
        </div>
      </div>
      <div v-else class="py-16 text-center">
        <UIcon name="i-heroicons-folder-open-20-solid" class="text-5xl text-neutral-300 dark:text-neutral-700" />
        <p class="text-neutral-600 dark:text-neutral-400">
          Noch keine Bücher hinzugefügt...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { formatPrice } from '~/utils/utils'
import type { Seller } from '~/interfaces/Seller'
import type { Book } from '~/interfaces/Book'
import type { Offer } from '~/interfaces/Offer'
import type { Exam } from '~/interfaces/Exam'
import type { Page } from '~/interfaces/Page'
import type { BookPriceBins } from '~/interfaces/PriceBin'

interface BookFields {
  isbn: string
  title: string
  authors: string
  publisher: string
  edition?: string
  maxPrice?: number
  exam_id?: number
}

const props = defineProps({
  seller: {
    type: Object as () => Seller,
    required: true,
  },
  onSubmit: {
    type: Function as PropType<(userData: Offer[]) => void>,
    required: true,
  },
  currentOffers: {
    type: Array as PropType<Offer[]>,
    default: () => [],
  }
})

const { token } = useAuth()
const loading = ref(false)
const loadingIsbn = ref(false)
const form = ref()
const selected = ref(undefined as Book | undefined)
const offers = ref(props.currentOffers as Offer[])
const checkedIsbn = ref(false)
const exams = ref([] as Exam[])
const offerErrors = ref(false)
const bookPriceBins = ref(undefined as BookPriceBins | undefined)
const currentPriceBinsIsbn = ref('')  // Track which offer's price bins are being displayed

const formState = reactive({
  isbn: '',
  title: '',
  authors: '',
  publisher: '',
  edition: undefined,
  maxPrice: undefined as number | undefined,
  exam_id: undefined,
})

const formValidate = (state: BookFields): FormError[] => {
  const errors = []

  errors.push(...isbnValidators(state))
  if (!state.title) errors.push({ name: 'title', message: 'Titel ist verpflichtend' })
  if (!state.authors) errors.push({ name: 'authors', message: 'Autor(en) sind verpflichtend' })
  if (!state.publisher) errors.push({ name: 'publisher', message: 'Verlag ist verpflichtend' })
  if (!state.maxPrice) errors.push({ name: 'maxPrice', message: 'Max. Preis ist verpflichtend' })
  //if (state.maxPrice && state.maxPrice <= 0) errors.push({ name: 'maxPrice', message: 'Max. Preis muss größer als 0 sein' })
  if (!state.edition) errors.push({ name: 'edition', message: 'Auflage ist verpflichtend' })
  //if (state.edition && !/^\d+$/.test(state.edition)) errors.push({ name: 'edition', message: 'Auflage muss eine Zahl sein' })
  //if (state.edition && state.edition <= 0) errors.push({ name: 'edition', message: 'Auflage muss größer als 0 sein' })
  return errors
}

const isbnValidators = (state: BookFields): FormError[] => {
  const errors = []

  if (!state.isbn) errors.push({ name: 'isbn', message: 'ISBN ist verpflichtend' })
  if (state.isbn && !/^\d+$/.test(state.isbn)) errors.push({ name: 'isbn', message: 'ISBN darf nur Ziffern enthalten' })
  if (state.isbn && state.isbn.toString().length !== 13) errors.push({ name: 'isbn', message: 'ISBN muss aus genau 13 Ziffern bestehen' })

  return errors
}

await fetchExams()

const handleIsbnSearch = async () => {
  loadingIsbn.value = true
  clearForm(formState.isbn)

  // Check if the isbn is of length 13 and only contains numbers
  const errors = isbnValidators(formState)

  if (errors.length > 0) {
    form.value.setErrors(form.value.errors.concat(errors))
    loadingIsbn.value = false
    return
  }

  try {
    const singleBook = await $fetch<Book>(useRuntimeConfig().public.apiUrl + `/books/${formState.isbn}`, {
      headers: {
        Authorization: `${token.value}`,
      },
    })

    if (singleBook) {
      selected.value = singleBook
      fetchPriceBins(singleBook.isbn)
    } else {
      selected.value = undefined
      console.error('No book found')
    }
  } catch (error) {
    selected.value = undefined
    console.error('Error while fetching book', error)

    bookPriceBins.value = undefined
  }

  checkedIsbn.value = true
  loadingIsbn.value = false
}

// This anonymous function is called by the UForm component to create a new book
const onBookCreate = async (event: FormSubmitEvent<BookFields>) => {
  loading.value = true

  const body = {...event.data}

  if (body.exam_id === undefined) {
    delete body.exam_id
  }

  const response = await fetch(useRuntimeConfig().public.apiUrl + '/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token.value}`,
    },
    body: JSON.stringify(body),
  })

  if (response.ok) {
    // First create the book and then create the offer draft
    const newBook = await response.json()
    createOffer(newBook)
  } else {
    selected.value = undefined
    console.error('No book created')

    const data = await response.json()
    const errors = []
    for (const field in data) {
      if (data[field].length > 0) {
        errors.push({
          name: field,
          message: data[field][0]
        })
      }
    }
    form.value.setErrors(errors)
  }
  loading.value = false
}

const handleDeleteItem = (item: Offer) => {
  const index = offers.value.indexOf(item)
  if (index !== -1) {
    offers.value.splice(index, 1)
  }
}

const handleSubmitOffers = () => {
  props.onSubmit(offers.value)
}

function createOffer(book: Book | undefined) {
  if (!book) {
    return
  }

  checkedIsbn.value = false

  const offer: Offer = {
    book: book,
    price: book.maxPrice,
    seller: props.seller,
    active: true,
    createdAt: new Date(),
    modified: new Date(),
    marked: false,
    location: '',
  }

  offers.value.push(offer)
  clearForm()
}

const clearForm = (isbn?: string) => {
  formState.isbn = isbn || ''
  formState.title = ''
  formState.authors = ''
  formState.maxPrice = undefined
  formState.edition = undefined
  formState.publisher = ''
  formState.exam_id = undefined
  
  selected.value = undefined
  bookPriceBins.value = undefined
  currentPriceBinsIsbn.value = ''

  form.value?.clear()
}

async function fetchExams() {
  const response = await $fetch<Page<Exam>>(useRuntimeConfig().public.apiUrl + '/exams', {
    headers: {
      Authorization: `${token.value}`,
    },
  })
  
  exams.value.push({id: null, name: '-Keine Prüfung-'})
  exams.value.push(...response.results)
}

async function fetchPriceBins(isbn: string) {
  currentPriceBinsIsbn.value = isbn
  await $fetch(useRuntimeConfig().public.apiUrl + `/books/${isbn}/price-bins`, {
    headers: {
      Authorization: `${token.value}`,
    },
  })
  .then((res) => {
    bookPriceBins.value = res as BookPriceBins
  })
  .catch((error) => {
    console.error('Error while fetching price bins', error)
    bookPriceBins.value = undefined
    currentPriceBinsIsbn.value = ''
  })
}
</script>