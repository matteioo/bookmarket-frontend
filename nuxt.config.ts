// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    'nuxt-auth-fork',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    myProxyUrl: '',
  },
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: 'local',
      endpoints: {
        getSession: { path: '/user', method: 'get' },
      },
      sessionDataType: {
        id: 'string',
        email: 'string',
        username: 'string',
      },
      token: {
        secureCookieAttribute: true,
      }
    },
    globalAppMiddleware: {
      isEnabled: true,
    }
  }
})
