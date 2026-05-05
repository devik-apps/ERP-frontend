import createClient from 'openapi-fetch'
import type { paths } from '~/api/types.gen'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = createClient<paths>({
    baseUrl: config.public.apiBase as string,
  })

  return {
    provide: { api },
  }
})
