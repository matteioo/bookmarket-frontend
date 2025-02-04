// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-09',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    '@sidebase/nuxt-auth',
    'dayjs-nuxt',
    '@nuxt/eslint',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    }
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
        // TODO: implement cookie domain for production, when domains are defined
        //cookieDomain: process.env.NUXT_PUBLIC_COOKIE_DOMAIN || 'localhost',
        secureCookieAttribute: true,
        // TODO: remove sameSiteAttribute 'None' for production, when domains are defined
        sameSiteAttribute: 'none',
      }
    },
    globalAppMiddleware: {
      isEnabled: true,
    }
  }
})
