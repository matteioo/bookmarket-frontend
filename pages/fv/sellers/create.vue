<template>
  <UForm ref="form" :validate="validate" :state="state" class="w-full max-w-xs space-y-4" @submit="createSeller">
      <UFormGroup label="Name" name="fullName" hint="vollständiger Name" required>
        <UInput v-model="state.fullName" type="text" />
      </UFormGroup>

      <UFormGroup label="Matrikelnummer" name="matriculationNumber" required>
        <UInput v-model="state.matriculationNumber" type="text" />
      </UFormGroup>

      <UFormGroup label="Email" name="email" required>
        <UInput v-model="state.email" type="email" />
      </UFormGroup>

      <UButton type="submit" class="float-right" :loading="loading">
        Anlegen
      </UButton>
    </UForm>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: 'auth',
  layout: 'protected',
});

const authStore = useAuthStore()
const router = useRouter()
const form = ref()
const loading = ref(false)

const state = reactive({
  fullName: '',
  matriculationNumber: '',
  email: '',
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
  return errors
}

async function createSeller(event: FormSubmitEvent<any>) {
  loading.value = true
  form.value.clear()
  
  const response = await fetch('/api/sellers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authStore.token}`,
    },
    body: JSON.stringify(event.data),
  })
  loading.value = false

  if (response.ok) {
    useToast().add({
      title: 'Erfolg',
      description: 'Verkäufer:in erfolgreich angelegt.',
      icon: 'i-heroicons-check-circle',
      color: 'green',
    })
    router.push('/fv/sellers')
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