<template>
  <div class="w-full max-w-80">
    <h1 class="font-semibold text-xl text-center text-primary-900 dark:text-primary-100 p-4">Login für FV-Mitglieder</h1>
    <UForm :validate="validate" :state="state" class="space-y-4" @submit="login">
      <UFormGroup label="Benutzername" name="username">
        <UInput v-model="state.username" type="text" />
      </UFormGroup>

      <UFormGroup label="Passwort" name="password">
        <template #hint>
          <ULink
            to="/fv"
            class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200"
          >
            Passwort vergessen?
          </ULink>
        </template>
        <template #default>
          <UInput v-model="state.password" type="password" />
        </template>
      </UFormGroup>

      <UButton block :loading="loading" type="submit">
        Anmelden
      </UButton>

      <div>
        Noch kein Konto? <ULink to="/register" class="inline-flex items-center text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200">Hier anfordern <UIcon name="i-heroicons-arrow-right" /></ULink>
      </div>
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
      description: 'Benutzername und/oder Passwort ist falsch',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red',
    })
  } finally {
    loading.value = false
    state.username = ''
    state.password = ''
  }
}
</script>