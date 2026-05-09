import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

const isTest = !!process.env.VITEST

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: isTest ? 0 : 1000 * 60,
        gcTime: isTest ? 0 : 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  })
  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
})
