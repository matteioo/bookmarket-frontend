// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-09',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    '@sidebase/nuxt-auth',
    'dayjs-nuxt',
    'nuxt-security'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  security: {
    nonce: true, // Enables HTML nonce support in SSR mode
    headers: {
      contentSecurityPolicy: {
        'script-src': [
          "'strict-dynamic'", // Modify with your custom CSP sources
          "'nonce-{{nonce}}'" // Enables CSP nonce support for scripts in SSR mode, supported by almost any browser (level 2)
        ]
      }
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
      apiUrl: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1/auth',
    },
    myProxyUrl: '',
  },
  auth: {
    originEnvKey: 'AUTH_ORIGIN', 
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        getSession: { path: '/user', method: 'get' },
      },
      session: {
        dataType: {
          id: 'string',
          email: 'string',
          username: 'string',
        },
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
