import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { ApiResponse } from '@tsanta22kyle/erp-client'
import type { ErpApi } from '~/plugins/api.client'

/**
 * Récupère la charge JSON brute renvoyée par le serveur, sans passer par les
 * convertisseurs FromJSON du SDK (qui suppriment les champs non décrits dans
 * l'OpenAPI et réécrivent la casse PascalCase du backend en camelCase).
 */
export async function rawJson<T>(p: Promise<ApiResponse<T>>): Promise<T> {
  const res = await p
  return (await res.raw.json()) as T
}

export function useApiQuery<T>(
  queryKey: MaybeRefOrGetter<unknown[]>,
  queryFn: (api: ErpApi) => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) {
  const { $api } = useNuxtApp()

  return useQuery<T>({
    queryKey: computed(() => toValue(queryKey)),
    queryFn: () => queryFn($api as ErpApi),
    ...options,
  })
}
