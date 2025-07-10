<template>
  <UForm ref="form" :validate="validate" :state="state" class="w-full space-y-4" @submit="submitBook">
    <UFormField label="ISBN" name="isbn" required>
      <UInput v-model="state.isbn" type="text" placeholder="9876543210987" autocomplete="off" class="w-full" />
    </UFormField>

    <UFormField label="Titel" name="title" required>
      <UInput v-model="state.title" type="text" placeholder="Beispielbuch" class="w-full" />
    </UFormField>

    <UFormField label="Autoren" name="authors" required>
      <UInput v-model="state.authors" type="text" placeholder="Vorname Nachname, Vorname Nachname, ..." class="w-full" />
    </UFormField>

    <UFormField label="Verlag" name="publisher" required>
      <UInput v-model="state.publisher" type="text" placeholder="FVJus Verlag" class="w-full" />
    </UFormField>

    <div class="inline-flex flex-row gap-x-2">
      <UFormField label="Auflage" name="edition" required>
        <UInput v-model="state.edition" type="number" placeholder="14" class="w-full" />
      </UFormField>
      
      <UFormField label="Max. Preis" name="maxPrice" required>
        <FormInputPrice v-model="state.maxPrice" label="maxPrice" class="w-full" />
      </UFormField>
    </div>

    <UFormField label="Prüfung" name="exam_id">
      <USelect v-model="state.exam_id" :items="exams" label-key="name" value-key="id" class="w-full" placeholder="Prüfung auswählen" />
    </UFormField>

    <div class="w-full mt-2 flex flex-row justify-end gap-x-2">
      <UButton color="primary" variant="outline" label="Zurücksetzen" @click="clearForm" />
      <UButton type="submit" class="float-right" :loading="loading" variant="solid" label="Anlegen" />
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import type { Book } from '~/interfaces/Book'
import type { Exam } from '~/interfaces/Exam'
import type { Page } from '~/interfaces/Page'

interface BookFields {
  isbn: string
  title: string
  authors: string
  publisher: string
  edition?: number
  maxPrice?: number
  exam_id?: number
}

const props = defineProps({
  onSubmit: {
    type: Function as PropType<(userData: Book) => void>,
    required: true
  }
})

const { token } = useAuth()
const form = ref()
const loading = ref(false)
const exams = ref([] as Exam[])

onMounted(fetchExams)

const state = reactive<BookFields>({
  isbn: '',
  title: '',
  authors: '',
  publisher: '',
  edition: undefined,
  maxPrice: undefined,
  exam_id: undefined,
})

const validate = (state: BookFields): FormError[] => {
  const errors = []
  
  errors.push(...isbnValidators(state))
  if (!state.title) errors.push({ name: 'title', message: 'Titel ist verpflichtend' })
  if (!state.authors) errors.push({ name: 'authors', message: 'Autor(en) sind verpflichtend' })
  if (!state.publisher) errors.push({ name: 'publisher', message: 'Verlag ist verpflichtend' })
  //if (!state.maxPrice) errors.push({ name: 'maxPrice', message: 'Max. Preis ist verpflichtend' })
  //if (state.maxPrice && state.maxPrice <= 0) errors.push({ name: 'maxPrice', message: 'Max. Preis muss größer als 0 sein' })
  if (!state.edition) errors.push({ name: 'edition', message: 'Auflage ist verpflichtend' })
  if (state.edition && state.edition <= 0) errors.push({ name: 'edition', message: 'Auflage muss größer als 0 sein' })
  return errors
}

const isbnValidators = (state: BookFields): FormError[] => {
  const errors = []

  if (!state.isbn) errors.push({ name: 'isbn', message: 'ISBN ist verpflichtend' })
  if (state.isbn && !/^\d+$/.test(state.isbn)) errors.push({ name: 'isbn', message: 'ISBN darf nur Ziffern enthalten' })
  if (state.isbn && state.isbn.toString().length !== 13) errors.push({ name: 'isbn', message: 'ISBN muss aus genau 13 Ziffern bestehen' })

  return errors
}

async function submitBook(event: FormSubmitEvent<BookFields>) {
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
    body: JSON.stringify(event.data),
  })
  loading.value = false
  
  if (response.ok) {
    const book = await response.json()
    useToast().add({
      title: 'Erfolg',
      description: 'Buch erfolgreich angelegt.',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })

    props.onSubmit(book)
  } else {
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

    useToast().add({
      title: 'Fehler',
      description: 'Buch konnte nicht angelegt werden!',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'error',
    })
  }
}

const clearForm = () => {
  state.isbn = ''
  state.title = ''
  state.authors = ''
  state.maxPrice = undefined
  state.edition = undefined
  state.publisher = ''
  state.exam_id = undefined
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
</script>