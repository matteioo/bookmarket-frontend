<template>
  <UForm ref="form" :validate="validate" :state="state" class="w-full space-y-4" @submit="onSubmit">
    <UFormGroup label="ISBN" name="isbn" required>
      <UInput v-model="state.isbn" type="text" placeholder="9876543210987" class="flex-grow" autocomplete="off" />
    </UFormGroup>

    <UFormGroup label="Titel" name="title" required>
      <UInput v-model="state.title" type="text" placeholder="Beispielbuch" />
    </UFormGroup>

    <UFormGroup label="Autoren" name="authors" required>
      <UInput v-model="state.authors" type="text" placeholder="Vorname Nachname, Vorname Nachname, ..." />
    </UFormGroup>

    <UFormGroup label="Verlag" name="publisher" required>
      <UInput v-model="state.publisher" type="text" placeholder="FVJus Verlag" />
    </UFormGroup>

    <div class="inline-flex flex-row gap-x-2">
      <UFormGroup label="Auflage" name="edition" required>
        <UInput v-model="state.edition" type="text" placeholder="14" />
      </UFormGroup>
      
      <UFormGroup label="Max. Preis" name="maxPrice" required>
        <UInput v-model="state.maxPrice" type="text" placeholder="14.50">
          <template #leading>
            <span class="text-gray-500 dark:text-gray-400 text-xs">&euro;</span>
          </template>
        </UInput>
      </UFormGroup>
    </div>

    <UFormGroup label="Prüfung" name="exam_id">
      <USelect v-model="state.exam_id" :options="exams" option-attribute="name" value-attribute="id" />
    </UFormGroup>

    <div class="w-full mt-2 flex flex-row justify-end gap-x-2">
      <UButton color="primary" variant="link" label="Zurücksetzen" @click="clearForm" />
      <UButton type="submit" class="float-right" :loading="loading" :variant="(buttonVariant as ButtonVariant)" :label="buttonContent" />
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent, ButtonVariant } from '#ui/types'
import type { Book } from '~/interfaces/Book';
import type { Exam } from '~/interfaces/Exam';
import type { Page } from '~/interfaces/Page';

const props = defineProps({
  buttonVariant: {
    type: String,
    required: false,
    default: 'solid',
  },
  buttonContent: {
    type: String,
    required: false,
    default: 'Anlegen',
  },
  onSubmit: {
    type: Function as PropType<(userData: Book) => void>,
    required: true
  }
});

const { token } = useAuth();
const form = ref()
const loading = ref(false)
const exams = ref([] as Exam[]);

onMounted(fetchExams);

const state = reactive({
  isbn: '',
  title: '',
  authors: '',
  maxPrice: undefined,
  edition: undefined,
  publisher: '',
  exam_id: undefined,
})

const validate = (state: any): FormError[] => {
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

async function onSubmit(event: FormSubmitEvent<any>) {
  loading.value = true;

  let body = {...event.data};
  if (body.exam_id === undefined) {
    delete body.exam_id;
  }

  const response = await fetch('/api/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify(event.data),
  })
  loading.value = false
  
  if (response.ok) {
    const book = await response.json();
    useToast().add({
      title: 'Erfolg',
      description: 'Buch erfolgreich angelegt.',
      icon: 'i-heroicons-check-circle',
      color: 'green',
    })

    props.onSubmit(book);
  } else {
    const data = await response.json()
    
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

    useToast().add({
      title: 'Fehler',
      description: 'Buch konnte nicht angelegt werden!',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red',
    })
  }
};

const clearForm = () => {
  state.isbn = '';
  state.title = '';
  state.authors = '';
  state.maxPrice = undefined;
  state.edition = undefined;
  state.publisher = '';
  state.exam_id = undefined;
}

async function fetchExams() {
  const response = await $fetch<Page<Exam>>('/api/exams', {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });
  
  exams.value.push({id: null, name: ''});
  exams.value.push(...response.results);
}
</script>