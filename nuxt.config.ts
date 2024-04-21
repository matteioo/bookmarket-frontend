// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    'nuxt-auth-fork',
    'dayjs-nuxt',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  dayjs: {
    locales: ['de'],
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'de',
    defaultTimezone: 'Europe/Vienna',
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1',
    },
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
