import { useMutation, type UseMutationOptions } from '@tanstack/vue-query'
import type { ErpApi } from '~/plugins/api.client'

export function useApiMutation<TData, TVariables = void>(
  mutationFn: (api: ErpApi, variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>,
) {
  const { $api } = useNuxtApp()

  return useMutation<TData, Error, TVariables>({
    mutationFn: (variables) => mutationFn($api as ErpApi, variables),
    ...options,
  })
}
