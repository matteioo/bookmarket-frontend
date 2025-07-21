export default defineNuxtPlugin((nuxtApp) => {
  const { token, signOut } = useAuth()

  const api = $fetch.create({
    baseURL: useRuntimeConfig().public.apiUrl,
    onRequest({ request: _request, options, error: _error }) {
      if (token.value) {
        options.headers.set('Authorization', `${token.value}`)
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => useToast().add({
          title: 'Sitzung beendet',
          description: 'Die aktuelle Sitzung ist abgelaufen, neu einloggen um weiterzumachen.',
          icon: 'i-lucide-log-out',
          color: 'info',
        }))
        await nuxtApp.runWithContext(() => signOut({ callbackUrl: '/login' }))
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})