<template>
  <UModal v-model:open="showModal">
    <template #content>
      <UCard>
        <UForm ref="form" :validate="validate" :state="state" class="w-full space-y-4" @submit="onSubmit">
          <UFormField label="Titel" name="title" required>
            <UInput v-model="state.title" type="text" placeholder="Buchtitel" class="w-full" />
          </UFormField>

          <UFormField label="Autoren" name="authors" required>
            <UInput v-model="state.authors" type="text" placeholder="Vorname Nachname, Vorname Nachname, ..." class="w-full" />
          </UFormField>

          <UFormField label="Verlag" name="publisher" required>
            <UInput v-model="state.publisher" type="text" placeholder="FVJus Verlag" class="w-full" />
          </UFormField>

          <UFormField label="Prüfung" name="exam_id">
            <USelect v-model="state.exam_id" :items="exams" label-key="name" value-key="id" placeholder="Prüfung auswählen" class="w-full" />
          </UFormField>

          <div class="grid grid-cols-2 gap-x-4">
            <UFormField label="Auflage" name="edition" required>
              <UInput v-model="state.edition" type="text" placeholder="14" class="w-full" />
            </UFormField>

            <UFormField label="Max. Preis" name="maxPrice" required>
              <FormInputPrice
                v-model="state.maxPrice"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="inline-flex flex-row-reverse gap-x-2 w-full">
            <UButton type="submit" :loading="loading" variant="solid">
              Buch bearbeiten
            </UButton>
            <UButton :loading="loading" variant="soft" @click="clearForm">
              Abbrechen
            </UButton>
          </div>
        </UForm>
      </UCard>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { FormError, FormSubmitEvent } from '#ui/types'
import type { Book } from '~/interfaces/Book'
import type { Exam } from '~/interfaces/Exam'
import type { Page } from '~/interfaces/Page'

interface BookFields {
  isbn: string
  title: string
  authors: string
  maxPrice: number
  edition: string
  publisher: string
  exam_id: number | null
}

const props = defineProps({
  initialBook: {
    type: Object as PropType<Book>,
    required: true
  },
  onSubmit: {
    type: Function as PropType<(userData: Book) => void>,
    required: true
  },
})
const showModal = defineModel<boolean>()

const { $api } = useNuxtApp()
const form = ref()
const loading = ref<boolean>(false)
const book = ref<Book | undefined>()
const exams = ref<Exam[]>([])

const state = reactive<BookFields>({
  isbn: props.initialBook.isbn,
  title: props.initialBook.title,
  authors: props.initialBook.authors,
  maxPrice: props.initialBook.maxPrice,
  edition: props.initialBook.edition,
  publisher: props.initialBook.publisher,
  exam_id: props.initialBook.exam?.id || null
})

fetchExams()

watch(() => props.initialBook, (newBook) => {
  state.title = newBook.title
  state.authors = newBook.authors
  state.maxPrice = newBook.maxPrice
  state.edition = newBook.edition
  state.publisher = newBook.publisher
  state.exam_id = newBook.exam?.id || null
}, { deep: true })

const validate = (state: BookFields): FormError[] => {
  const errors = []

  if (!state.title) errors.push({ name: 'title', message: 'Titel ist verpflichtend' })
  if (!state.authors) errors.push({ name: 'authors', message: 'Autor(en) sind verpflichtend' })
  if (!state.publisher) errors.push({ name: 'publisher', message: 'Verlag ist verpflichtend' })
  if (!state.maxPrice) errors.push({ name: 'maxPrice', message: 'Max. Preis ist verpflichtend' })
  if (state.maxPrice && state.maxPrice <= 0) errors.push({ name: 'maxPrice', message: 'Max. Preis muss größer als 0 sein' })
  if (!state.edition) errors.push({ name: 'edition', message: 'Auflage ist verpflichtend' })
  //if (state.edition && !/^\d+$/.test(state.edition)) errors.push({ name: 'edition', message: 'Auflage muss eine Zahl sein' })
  //if (state.edition && state.edition <= 0) errors.push({ name: 'edition', message: 'Auflage muss größer als 0 sein' })
  return errors
}

const onSubmit = async (event: FormSubmitEvent<BookFields>) => {
  loading.value = true
  await editBook(event)
  loading.value = false

  if (book.value) {
    props.onSubmit(book.value)
  } else {
    console.error('No book submitted')
  }
}

async function editBook(event: FormSubmitEvent<BookFields>) {
  loading.value = true
  form.value.clear() 

  const editedBook = await $api<Book>(`/books/${props.initialBook.isbn}`, {
    method: 'PUT',
    body: event.data,
    onResponse: () => {
      loading.value = false
    },
    onResponseError: ({ response }) => {
      const data = response._data

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
        description: 'Buch konnte nicht bearbeitet werden!',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'error',
      })
    }
  })

  book.value = editedBook

  useToast().add({
    title: 'Erfolg',
    description: 'Buch erfolgreich bearbeitet.',
    icon: 'i-heroicons-check-circle',
    color: 'success',
  })
}

const clearForm = () => {
  form.value.clear()
  state.title = props.initialBook.title
  state.authors = props.initialBook.authors
  state.maxPrice = props.initialBook.maxPrice
  state.edition = props.initialBook.edition
  state.publisher = props.initialBook.publisher
  state.exam_id = props.initialBook.exam?.id || null

  showModal.value = false
}

async function fetchExams() {
  const { data } = await useApiFetch<Page<Exam>>('/exams')
  exams.value.push(...data.value?.results || [])
}
</script>