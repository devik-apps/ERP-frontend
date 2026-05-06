import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import createClient from 'openapi-fetch'
import type { paths } from '~/api/types.gen'

type ApiClient = ReturnType<typeof createClient<paths>>

export function useApiQuery<T>(
  queryKey: MaybeRefOrGetter<unknown[]>,
  queryFn: (api: ApiClient) => Promise<{ data?: T; error?: unknown }>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) {
  const { $api } = useNuxtApp()

  return useQuery<T>({
    queryKey: computed(() => toValue(queryKey)),
    queryFn: async () => {
      const { data, error } = await queryFn($api as ApiClient)
      if (error) throw error
      return data as T
    },
    ...options,
  })
}
