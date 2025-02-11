// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-02-06',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    '@sidebase/nuxt-auth',
    'dayjs-nuxt',
    'nuxt-security',
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
  runtimeConfig: {
    public: {
      appVersion: 'v0.1.0-beta',
      apiUrl: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1',
      authUrl: process.env.AUTH_ORIGIN,
    },
  },
  security: {
    enabled: process.env.NODE_ENV !== 'development',
    headers: {
      contentSecurityPolicy: {
        "script-src": [
          "'nonce-{{nonce}}'",
          // The nonce allows the root script
          "'strict-dynamic'" 
          // All scripts inserted by the root script will also be allowed
        ]
      }
    }
  },
  dayjs: {
    locales: ['de'],
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'de',
    defaultTimezone: 'Europe/Vienna',
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
