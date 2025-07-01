<template>
  <UForm ref="form" :validate="validate" :state="state" class="w-full space-y-4" @submit="onSubmit">
    <UFormField label="Name" name="fullName" hint="vollständiger Name" required>
      <UInput v-model="state.fullName" type="text" placeholder="Vorname Nachname" class="w-full" />
    </UFormField>

    <UFormField label="Matrikelnummer" name="matriculationNumber" required>
      <UInput v-model="state.matriculationNumber" type="text" placeholder="01234567" class="w-full" />
    </UFormField>

    <UFormField label="Email" name="email" required>
      <UInput v-model="state.email" type="email" placeholder="email@fvjus.at" class="w-full" />
    </UFormField>

    <UFormField label="Anmerkung" name="note">
      <UTextarea v-model="state.note" autoresize :maxrows="5" placeholder="Anmerkung über Verkäufer:in" class="w-full" />
    </UFormField>

    <UButton type="submit" class="float-right" :loading="loading" :variant="(props.buttonVariant as ButtonVariant)">
      {{ props.buttonContent }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import type { Seller } from '~/interfaces/Seller'

type ButtonVariant = 'solid' | 'outline'

interface SellerFields {
  fullName: string
  matriculationNumber: string
  email: string
  note: string
}

const props = defineProps({
  to: {
    type: String,
    required: false,
    default: undefined,
  },
  buttonVariant: {
    type: String as PropType<ButtonVariant>,
    required: false,
    default: 'solid',
  },
  buttonContent: {
    type: String,
    required: false,
    default: 'Anlegen',
  },
  onSubmit: {
    type: Function as PropType<(userData: Seller) => void>,
    required: true
  }
})

const { token } = useAuth()
const router = useRouter()
const form = ref()
const loading = ref(false)
const user = ref(null as Seller | null)

const state = reactive({
  fullName: '',
  matriculationNumber: '',
  email: '',
  note: '',
})

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
  await createSeller(event)

  if (user.value) {
    props.onSubmit(user.value)
  } else {
    console.error('No seller submitted')
  }
}

async function createSeller(event: FormSubmitEvent<SellerFields>) {
  loading.value = true
  form.value.clear()

  const response = await fetch(useRuntimeConfig().public.apiUrl + '/sellers', {
    method: 'POST',
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
      description: 'Verkäufer:in erfolgreich angelegt.',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })
    
    if (props.to) {
      router.push(props.to)
    }
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
      description: 'Verkäufer:in konnte nicht angelegt werden!',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'error',
    })
  }
}
</script>