import { useMutation, type UseMutationOptions } from '@tanstack/vue-query'
import createClient from 'openapi-fetch'
import type { paths } from '~/api/types.gen'

type ApiClient = ReturnType<typeof createClient<paths>>

export function useApiMutation<TData, TVariables = void>(
  mutationFn: (api: ApiClient, variables: TVariables) => Promise<{ data?: TData; error?: unknown }>,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>,
) {
  const { $api } = useNuxtApp()

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      const { data, error } = await mutationFn($api as ApiClient, variables)
      if (error) throw error
      return data as TData
    },
    ...options,
  })
}
