<template>
  <div class="w-full max-w-80">
    <h1 class="font-semibold text-xl text-center text-primary-900 dark:text-primary-100 p-4">Login für FV-Mitglieder</h1>
    <UForm :validate="validate" :state="state" class="space-y-4" @submit="login">
      <UFormField label="Benutzername" name="username">
        <UInput v-model="state.username" type="text" class="w-full" />
      </UFormField>

      <UFormField label="Passwort" name="password">
        <UInput v-model="state.password" type="password" class="w-full" />
      </UFormField>

      <UButton block :loading="loading" type="submit">
        Anmelden
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

interface LoginFields {
  username: string
  password: string
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

const { signIn } = useAuth()
const route = useRoute()
const router = useRouter()

const state = reactive<LoginFields>({
  username: '',
  password: '',
})

const loading = ref(false)

const validate = (state: LoginFields): FormError[] => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Benutzername ist verpflichtend' })
  if (!state.password) errors.push({ path: 'password', message: 'Passwort ist verpflichtend' })
  return errors
}

function getCallbackUrl(): string {
  const defaultCallback = '/fv'
  const redirect = route.query.redirect as string | undefined
  if (!redirect) return defaultCallback

  try {
    const parsedUrl = new URL(redirect, window.location.origin)
    if (parsedUrl.origin === window.location.origin && parsedUrl.pathname.startsWith('/fv')) {
      const resolved = router.resolve(parsedUrl.pathname)
      if (resolved.matched.length > 0) {
        return parsedUrl.pathname + parsedUrl.search
      }
    }
  } catch {
    // Ignore invalid URLs
  }
  return defaultCallback
}

async function login(event: FormSubmitEvent<LoginFields>) {
  try {
    loading.value = true
    await signIn({ username: event.data.username, password: event.data.password }, { callbackUrl: getCallbackUrl() })
  } catch {
    useToast().add({
      title: 'Fehler',
      description: 'Benutzername oder Passwort ist falsch',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'error',
    })
  } finally {
    loading.value = false
    state.username = ''
    state.password = ''
  }
}
</script>