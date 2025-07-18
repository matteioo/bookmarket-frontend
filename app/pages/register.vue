<template>
  <div class="w-full max-w-80">
    <h1 class="font-semibold text-xl text-center text-primary-900 dark:text-primary-100 p-4">Konto anfordern</h1>
    <UForm :validate="validate" :state="state" class="space-y-4" @submit="register">
      <UFormField label="Benutzername" name="username">
        <UInput v-model="state.username" type="text" class="w-full" />
      </UFormField>

      <UFormField label="Email" name="email">
        <UInput v-model="state.email" type="email" class="w-full" />
      </UFormField>

      <UFormField label="Passwort" name="password">
        <UInput v-model="state.password" type="password" class="w-full" />
      </UFormField>

      <UFormField label="Passwort wiederholen" name="repeatPassword">
        <UInput v-model="state.repeatPassword" type="password" class="w-full" />
      </UFormField>

      <UButton block :loading="loading" type="submit">
        Konto anfordern
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

interface LoginFields {
  username: string,
  email: string,
  password: string,
  repeatPassword: string,
}

useSeoMeta({
  title: 'Login',
  ogTitle: 'Login',
})

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/fv',
  }
})

const { signUp } = useAuth()

const state = reactive<LoginFields>({
  username: '',
  email: '',
  password: '',
  repeatPassword: '',
})
const loading = ref<boolean>(false)
const errorMessages = ref<FormError[]>([])

const validate = (state: LoginFields): FormError[] => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Benutzername ist verpflichtend' })
  if (!state.email) errors.push({ path: 'email', message: 'Email ist verpflichtend' })
  if (!state.password) errors.push({ path: 'password', message: 'Passwort ist verpflichtend' })
  if (/^\d+$/.test(state.password)) errors.push({ path: 'password', message: 'Passwort darf nicht nur aus Zahlen bestehen' })
  if (state.password.length < 9) errors.push({ path: 'password', message: 'Passwort muss mindestens 9 Zeichen lang sein' })
  if (state.password !== state.repeatPassword) errors.push({ path: 'repeatPassword', message: 'Passwörter stimmen nicht überein' })
  if (!state.repeatPassword) errors.push({ path: 'repeatPassword', message: 'Passwort ist verpflichtend' })
  if (/^\d+$/.test(state.repeatPassword)) errors.push({ path: 'repeatPassword', message: 'Passwort darf nicht nur aus Zahlen bestehen' })
  if (state.repeatPassword.length < 9) errors.push({ path: 'repeatPassword', message: 'Passwort muss mindestens 9 Zeichen lang sein' })

  errorMessages.value = errors
  return errors
}

async function register(event: FormSubmitEvent<LoginFields>) {
  try {
    loading.value = true

    useToast().add({
      title: 'Konto angefordert',
      description: 'Dein Konto muss jetzt noch freigeschaltet werden.',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })

    await signUp({
      username: event.data.username,
      email: event.data.email,
      password: event.data.password,
      repeatPassword: event.data.repeatPassword,
    }, { callbackUrl: '/login', redirect: true, preventLoginFlow: true })
  } catch {
    useToast().add({
      title: 'Fehler',
      description: 'Konto anlegen fehlgeschlagen.',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'error',
    })

    state.password = ''
    state.repeatPassword = ''
  } finally {
    loading.value = false
    state.username = ''
    state.email = ''
    state.password = ''
    state.repeatPassword = ''
  }
}
</script>