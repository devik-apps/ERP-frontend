import { useQueryClient } from '@tanstack/vue-query'
import type {
  Sale,
  SaleSummary,
  SalePayload,
  SalesGet200Response,
} from '@tsanta22kyle/erp-client'
import { rawJson, useApiQuery } from './useApiQuery'
import { useApiMutation } from './useApiMutation'

export type SaleSegment = 'Comptoir' | 'Pro' | 'Restaurant' | 'Gros'

/**
 * Extension UI-only : le serveur (mock) ajoute des champs de présentation
 * (`segment`, `top`, `seller`, `status`) qui ne figurent pas dans le schéma
 * OpenAPI mais sont consommés par la page Ventes.
 */
export interface SaleRow extends SaleSummary {
  segment?: SaleSegment
  status?: string
  top?: string
  seller?: string
}

export function useSales() {
  return useApiQuery<SalesGet200Response>(
    () => ['sales'],
    (api) => rawJson(api.sales.salesGetRaw({ limit: 50 })),
  )
}

export function useCreateSale() {
  const queryClient = useQueryClient()
  return useApiMutation<Sale, { id: string; payload: SalePayload }>(
    (api, vars) =>
      rawJson(api.sales.salesIdPutRaw({ id: vars.id, salePayload: vars.payload })),
    {
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['sales'] })
      },
    },
  )
}
