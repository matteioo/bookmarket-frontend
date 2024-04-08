<template>
  <UForm ref="form" :validate="validate" :state="state" class="w-full space-y-4" @submit="onSubmit">
    <UFormGroup label="Name" name="fullName" hint="vollständiger Name" required>
      <UInput v-model="state.fullName" type="text" placeholder="Vorname Nachname" />
    </UFormGroup>

    <UFormGroup label="Matrikelnummer" name="matriculationNumber" required>
      <UInput v-model="state.matriculationNumber" type="text" placeholder="01234567" />
    </UFormGroup>

    <UFormGroup label="Email" name="email" required>
      <UInput v-model="state.email" type="email" placeholder="email@fvjus.at" />
    </UFormGroup>

    <UFormGroup label="Anmerkung" name="note">
      <UTextarea autoresize :maxrows="5" v-model="state.note" placeholder="Anmerkung über Verkäufer:in" />
    </UFormGroup>

    <UButton type="submit" class="float-right" :loading="loading" :variant="(props.buttonVariant as ButtonVariant)">
      {{ props.buttonContent }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent, ButtonVariant } from '#ui/types'
import type { Seller } from '~/interfaces/Seller';

const props = defineProps({
  to: {
    type: String,
    required: false,
  },
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
    type: Function as PropType<(userData: Seller) => void>,
    required: true
  }
});

const { token } = useAuth()
const router = useRouter()
const form = ref()
const loading = ref(false)
const user = ref(null as Seller | null);

const state = reactive({
  fullName: '',
  matriculationNumber: '',
  email: '',
  note: '',
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.fullName) errors.push({ path: 'fullName', message: 'Name ist verpflichtend' })
  if (!state.matriculationNumber) errors.push({ path: 'matriculationNumber', message: 'Matrikelnummer ist verpflichtend' })
  if (state.matriculationNumber && !/^\d+$/.test(state.matriculationNumber))
    errors.push({ path: 'matriculationNumber', message: 'Matrikelnummer darf nur Ziffern enthalten' })
  if (state.matriculationNumber && state.matriculationNumber.toString().length !== 8)
    errors.push({ path: 'matriculationNumber', message: 'Matrikelnummer muss genau 8 Ziffern haben' })
  if (!state.email) errors.push({ path: 'email', message: 'Email ist verpflichtend' })
  if (state.note && state.note.length > 255) errors.push({ path: 'note', message: 'Anmerkung darf maximal 255 Zeichen enthalten' })
  return errors
}

const onSubmit = async (event: FormSubmitEvent<any>) => {
  await createSeller(event);

  if (user.value) {
    props.onSubmit(user.value);
  } else {
    console.error('No seller submitted');
  }
};

async function createSeller(event: FormSubmitEvent<any>) {
  loading.value = true;
  form.value.clear();

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
    user.value = await response.json();
    useToast().add({
      title: 'Erfolg',
      description: 'Verkäufer:in erfolgreich angelegt.',
      icon: 'i-heroicons-check-circle',
      color: 'green',
    })
    
    if (props.to) {
      router.push(props.to)
    }
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
      description: 'Verkäufer:in konnte nicht angelegt werden!',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red',
    })
  }
};
</script>