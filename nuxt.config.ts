import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-04',

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'https://api.erp.local/v1',
    },
  },

  devtools: { enabled: true },

  modules: [
    'shadcn-nuxt',
    '@serwist/nuxt',
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
