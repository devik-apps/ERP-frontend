import { useQueryClient } from '@tanstack/vue-query'
import { useApiQuery } from './useApiQuery'
import { useApiMutation } from './useApiMutation'
import type { components } from '~/api/types.gen'

type SaleSummary = components['schemas']['SaleSummary']
type SalePayload = components['schemas']['SalePayload']
type Sale = components['schemas']['Sale']

export type SaleSegment = 'Comptoir' | 'Pro' | 'Restaurant' | 'Gros'

export interface SaleRow extends SaleSummary {
  segment?: SaleSegment
  status?: string
  top?: string
  seller?: string
}

export function useSales() {
  return useApiQuery(
    () => ['sales'],
    (api) => api.GET('/sales', { params: { query: { limit: 50 } } }),
  )
}

export function useCreateSale() {
  const queryClient = useQueryClient()
  return useApiMutation<Sale, { id: string; payload: SalePayload }>(
    (api, vars) =>
      api.PUT('/sales/{id}', {
        params: { path: { id: vars.id } },
        body: vars.payload,
      }),
    {
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['sales'] })
      },
    },
  )
}
