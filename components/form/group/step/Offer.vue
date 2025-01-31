<template>
  <div class="flex flex-row gap-x-8">
    <!-- left side -->
    <div class="flex-shrink-0 w-96">
      <div class="sticky h-fit top-4">
        <UForm ref="form" :validate="formValidate" :state="formState" class="w-full space-y-4" @submit="onBookCreate">
          <UFormGroup label="ISBN" name="isbn" required>
            <UButtonGroup orientation="horizontal" class="w-full">
              <UInput v-model="formState.isbn" type="text" placeholder="9876543210987" class="flex-grow" autocomplete="off" @keydown.enter.prevent="handleIsbnSearch" />
              <UButton :loading="loadingIsbn" icon="i-heroicons-magnifying-glass" color="gray" @click="handleIsbnSearch" />
            </UButtonGroup>
          </UFormGroup>

          <UFormGroup v-if="!selected && checkedIsbn" label="Titel" name="title" required>
            <UInput v-model="formState.title" type="text" placeholder="Beispielbuch" />
          </UFormGroup>

          <UFormGroup v-if="!selected && checkedIsbn" label="Autoren" name="authors" required>
            <UInput v-model="formState.authors" type="text" placeholder="Vorname Nachname, Vorname Nachname, ..." />
          </UFormGroup>

          <UFormGroup v-if="!selected && checkedIsbn" label="Verlag" name="publisher" required>
            <UInput v-model="formState.publisher" type="text" placeholder="FVJus Verlag" />
          </UFormGroup>

          <div v-if="!selected && checkedIsbn" class="inline-flex flex-row gap-x-2">
            <UFormGroup label="Auflage" name="edition" required>
              <UInput v-model="formState.edition" type="text" placeholder="14" />
            </UFormGroup>
            
            <UFormGroup label="Max. Preis" name="maxPrice" required>
              <UInput v-model="formState.maxPrice" type="text" placeholder="14.50">
                <template #leading>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">&euro;</span>
                </template>
              </UInput>
            </UFormGroup>
          </div>

          <UFormGroup v-if="!selected && checkedIsbn" label="Prüfung" name="exam_id">
            <USelect v-model="formState.exam_id" :options="exams" option-attribute="name" value-attribute="id" />
          </UFormGroup>

          <div v-if="!selected && checkedIsbn" class="w-full mt-2 flex flex-row justify-end gap-x-2">
            <UButton color="primary" variant="link" label="Zurücksetzen" @click="clearForm" />
            <UButton type="submit" class="float-right" :loading="loading" variant="outline" label="Hinzufügen" />
          </div>
        </UForm>
  
        <div v-if="selected && checkedIsbn" class="w-full mt-4">
          <div class="grid grid-cols-6 gap-2">
            <DataLabel label="Titel" :data="selected.title" class="col-span-6" />
            <DataLabel label="ISBN" :data="selected.isbn" class="col-span-3" />
            <DataLabel label="Auflage" :data="String(selected.edition)" class="col-span-1" />
            <DataLabel label="Max. Preis" :data="formatPrice(selected.maxPrice)" class="col-span-2" />
            <DataLabel label="Zugehörige Prüfung" :data="selected.exam?.name" class="col-span-6" />
            <DataLabel label="Autoren" :data="selected.authors" class="col-span-6" />
            <DataLabel label="Verlag" :data="selected.publisher" class="col-span-6" />
          </div>
          <div class="w-full mt-2 flex flex-row justify-end gap-x-2">
            <UButton
              size="sm"
              color="primary"
              variant="outline"
              label="Hinzufügen"
              :disabled="!selected"
              @click="() => createOffer(selected)"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- right side -->
    <div class="flex-grow">
      <div v-if="offers.length !== 0" class="flex flex-grow flex-col gap-y-4">
        <div v-for="(offer, index) in offers" :key="offer.id">
          <CheckoutOfferItemCreate v-model="offers[index]" @delete-item="handleDeleteItem" @update:has-errors="(newValue) => offerErrors = newValue" />
        </div>
        <div class="w-full py-4 inline-flex flex-row justify-end backdrop-blur-md">
          <UButton label="Weiter" :disabled="offerErrors" @click="handleSubmitOffers" />
        </div>
      </div>
      <div v-else class="py-16 text-center">
        <UIcon name="i-heroicons-folder-open-20-solid" class="text-5xl text-gray-300 dark:text-gray-700" />
        <p class="text-gray-600 dark:text-gray-400">
          Noch keine Bücher hinzugefügt...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import type { Seller } from '~/interfaces/Seller';
import type { Book } from '~/interfaces/Book';
import type { Offer } from '~/interfaces/Offer';
import type { Member } from '~/interfaces/Member';
import type { Exam } from '~/interfaces/Exam';
import type { Page } from '~/interfaces/Page';
import { formatPrice } from '~/utils/utils';

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
});

const { token } = useAuth();
const loading = ref(false);
const loadingIsbn = ref(false);
const form = ref()
const selected = ref(undefined as Book | undefined);
const offers = ref(props.currentOffers as Offer[]);
const checkedIsbn = ref(false);
const exams = ref([] as Exam[]);
const offerErrors = ref(false);

const formState = reactive({
  isbn: '',
  title: '',
  authors: '',
  maxPrice: undefined,
  edition: undefined,
  publisher: '',
  exam_id: undefined,
})

const formValidate = (state: any): FormError[] => {
  const errors = []
  
  errors.push(...isbnValidators(state));
  if (!state.title) errors.push({ path: 'title', message: 'Titel ist verpflichtend' })
  if (!state.authors) errors.push({ path: 'authors', message: 'Autor(en) sind verpflichtend' })
  if (!state.publisher) errors.push({ path: 'publisher', message: 'Verlag ist verpflichtend' })
  if (!state.maxPrice) errors.push({ path: 'maxPrice', message: 'Max. Preis ist verpflichtend' })
  if (state.maxPrice && state.maxPrice <= 0) errors.push({ path: 'maxPrice', message: 'Max. Preis muss größer als 0 sein' })
  if (!state.edition) errors.push({ path: 'edition', message: 'Auflage ist verpflichtend' })
  if (state.edition && !/^\d+$/.test(state.edition)) errors.push({ path: 'edition', message: 'Auflage darf nur Ziffern enthalten' })
  if (state.edition && state.edition <= 0) errors.push({ path: 'edition', message: 'Auflage muss größer als 0 sein' })
  return errors
}

const isbnValidators = (state: any): FormError[] => {
  const errors = [];

  if (!state.isbn) errors.push({ path: 'isbn', message: 'ISBN ist verpflichtend' })
  if (state.isbn && !/^\d+$/.test(state.isbn)) errors.push({ path: 'isbn', message: 'ISBN darf nur Ziffern enthalten' })
  if (state.isbn && state.isbn.toString().length !== 13) errors.push({ path: 'isbn', message: 'ISBN muss aus genau 13 Ziffern bestehen' })

  return errors;
}

await fetchExams();

const handleIsbnSearch = async () => {
  loadingIsbn.value = true;

  // Check if the isbn is of length 13 and only contains numbers
  const errors = isbnValidators(formState);

  
  if (errors.length > 0) {
    form.value.setErrors(form.value.errors.concat(errors));
    loadingIsbn.value = false;
    return;
  }

  try {
    const singleBook = await $fetch<Book>(useRuntimeConfig().public.apiUrl + `/books/${formState.isbn}`, {
      headers: {
        Authorization: `${token.value}`,
      },
    });

    if (singleBook) {
      selected.value = singleBook;
    } else {
      selected.value = undefined;
      console.error('No book found');
    }
  } catch (error) {
    selected.value = undefined;
    console.error('Error while fetching book', error);
  }

  checkedIsbn.value = true;
  loadingIsbn.value = false;
}

// This anonymous function is called by the UForm component to create a new book
const onBookCreate = async (event: FormSubmitEvent<any>) => {
  loading.value = true;

  const body = {...event.data};

  if (body.exam_id === undefined) {
    delete body.exam_id;
  }

  const response = await fetch(useRuntimeConfig().public.apiUrl + '/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token.value}`,
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const newBook = await response.json();
    createOffer(newBook);
    clearForm();
  } else {
    selected.value = undefined;
    console.error('No book created');

    const data = await response.json();
    const errors = [];
    for (const field in data) {
      if (data[field].length > 0) {
        errors.push({
          path: field,
          message: data[field][0]
        });
      }
    }
    form.value.setErrors(errors);
  }
  loading.value = false;
}

const handleDeleteItem = (item: Offer) => {
  const index = offers.value.indexOf(item);
  if (index !== -1) {
    offers.value.splice(index, 1);
  }
}

const handleSubmitOffers = () => {
  props.onSubmit(offers.value);
}

const member: Member = {
  id: 0,
  username: 'username',
  email: 'emailAddress', 
};

function createOffer(book: Book | undefined) {
  if (!book) {
    return;
  }

  checkedIsbn.value = false;

  const offer: Offer = {
    book: book,
    price: book.maxPrice,
    seller: props.seller,
    member: member,
    active: true,
    createdAt: new Date(),
    modified: new Date(),
    marked: false,
    location: '',
  };

  offers.value.push(offer);
  clearForm();
}

const clearForm = () => {
  formState.isbn = '';
  formState.title = '';
  formState.authors = '';
  formState.maxPrice = undefined;
  formState.edition = undefined;
  formState.publisher = '';
  formState.exam_id = undefined;
  
  selected.value = undefined;
}

async function fetchExams() {
  const response = await $fetch<Page<Exam>>(useRuntimeConfig().public.apiUrl + '/exams', {
    headers: {
      Authorization: `${token.value}`,
    },
  });
  
  exams.value.push({id: null, name: ''});
  exams.value.push(...response.results);
}
</script>