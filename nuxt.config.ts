import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-04',

  runtimeConfig: {
    // Serveur uniquement — cible réelle du proxy Nitro `/api/v1/[...]`.
    erpBackendUrl: process.env.ERP_BACKEND_URL ?? 'https://api.erp.local/v1',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'https://api.erp.local/v1',
    },
  },

  app: {
    head: {
      meta: [
        { name: 'theme-color', content: '#4A6274' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Poissonnerie' },
        { name: 'mobile-web-app-capable', content: 'yes' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'icon', type: 'image/svg+xml', href: '/icons/icon.svg' },
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.svg' },
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
    '@nuxtjs/supabase',
    ...(process.env.VITEST ? ['@nuxt/test-utils/module'] : []),
  ],

  supabase: {
    url: process.env.SUPABASE_URL || 'http://127.0.0.1:54321',
    key: process.env.SUPABASE_KEY || 'public-anon-key',
    redirect: !process.env.VITEST,
    useSsrCookies: !process.env.VITEST,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/login'],
    },
  },

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
