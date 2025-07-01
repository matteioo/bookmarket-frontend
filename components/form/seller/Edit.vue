<template>
  <UModal v-model:open="showModal">
    <template #content>
      <UCard>
        <UForm ref="form" :validate="validate" :state="state" class="w-full space-y-4" @submit="onSubmit">
          <UFormField label="Name" name="fullName" hint="vollständiger Name" required>
            <UInput v-model="state.fullName" type="text" placeholder="Vorname Nachname" class="w-full" />
          </UFormField>

          <UFormField label="Matrikelnummer" name="matriculationNumber" required>
            <UInput v-model="state.matriculationNumber" type="text" placeholder="01234567" :disabled="true" class="w-full" />
          </UFormField>

          <UFormField label="Email" name="email" required>
            <UInput v-model="state.email" type="email" placeholder="email@fvjus.at" class="w-full" />
          </UFormField>

          <UFormField label="Anmerkung" name="note">
            <UTextarea v-model="state.note" autoresize :maxrows="5" placeholder="Anmerkung über Verkäufer:in" class="w-full" />
          </UFormField>

          <div class="inline-flex flex-row-reverse gap-x-2 w-full">
            <UButton type="submit" :loading="loading" variant="solid">
              Verkäufer:in bearbeiten
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
import type { Seller } from '~/interfaces/Seller'

interface SellerFields {
  fullName: string
  matriculationNumber: string
  email: string
  note: string
}

const props = defineProps({
  initialSeller: {
    type: Object as PropType<Seller>,
    required: true
  },
  onSubmit: {
    type: Function as PropType<(userData: Seller) => void>,
    required: true
  },
})
const showModal = defineModel<boolean>()

const { token } = useAuth()
const form = ref()
const loading = ref(false)
const user = ref(null as Seller | null)

const state = reactive({
  fullName: props.initialSeller.fullName,
  matriculationNumber: props.initialSeller.matriculationNumber,
  email: props.initialSeller.email,
  note: props.initialSeller.note,
})

watch(() => props.initialSeller, (newSeller) => {
  state.fullName = newSeller.fullName
  state.matriculationNumber = newSeller.matriculationNumber
  state.email = newSeller.email
  state.note = newSeller.note
}, { deep: true })

const validate = (state: SellerFields): FormError[] => {
  const errors = []
  if (!state.fullName) errors.push({ name: 'fullName', message: 'Name ist verpflichtend' })
  if (!state.matriculationNumber) errors.push({ name: 'matriculationNumber', message: 'Matrikelnummer ist verpflichtend' })
  if (state.matriculationNumber && !/^\d+$/.test(state.matriculationNumber))
    errors.push({ name: 'matriculationNumber', message: 'Matrikelnummer darf nur Ziffern enthalten' })
  if (state.matriculationNumber && state.matriculationNumber.toString().length !== 8)
    errors.push({ name: 'matriculationNumber', message: 'Matrikelnummer muss genau 8 Ziffern haben' })
  if (!state.email) errors.push({ name: 'email', message: 'Email ist verpflichtend' })
  if (state.note && state.note.length > 255) errors.push({ name: 'note', message: 'Anmerkung darf maximal 255 Zeichen enthalten' })
  return errors
}

const onSubmit = async (event: FormSubmitEvent<SellerFields>) => {
  loading.value = true
  await createSeller(event)
  loading.value = false

  if (user.value) {
    props.onSubmit(user.value)
  } else {
    console.error('No seller submitted')
  }
}

async function createSeller(event: FormSubmitEvent<SellerFields>) {
  loading.value = true
  form.value.clear()

  const response = await fetch(useRuntimeConfig().public.apiUrl + '/sellers/' + props.initialSeller.id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token.value}`,
    },
    body: JSON.stringify(event.data),
  })
  loading.value = false
  
  if (response.ok) {
    user.value = await response.json()
    useToast().add({
      title: 'Erfolg',
      description: 'Verkäufer:in erfolgreich bearbeitet.',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })
    showModal.value = false
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
      description: 'Verkäufer:in konnte nicht bearbeitet werden!',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'error',
    })
  }
}

const clearForm = () => {
  form.value.clear()
  state.fullName = props.initialSeller.fullName
  state.matriculationNumber = props.initialSeller.matriculationNumber
  state.email = props.initialSeller.email
  state.note = props.initialSeller.note

  showModal.value = false
}
</script>