import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-04',

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'https://api.erp.local/v1',
    },
  },

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500&display=swap' },
      ],
    },
  },

  devtools: { enabled: true },

  modules: [
    'shadcn-nuxt',
    '@serwist/nuxt',
    ...(process.env.VITEST ? ['@nuxt/test-utils/module'] : []),
  ],

  css: ['./app/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  serwist: {
    swSrc: 'service-worker.ts',
    swDest: 'sw.js',
    globDirectory: '.output/public',
  },
})
