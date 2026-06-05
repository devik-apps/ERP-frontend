import { useQueryClient } from '@tanstack/vue-query'
import type {
  Sale,
  SalePayload,
  SalesGet200Response,
} from '@tsanta22kyle/erp-client'
import { rawJson, useApiQuery } from './useApiQuery'
import { useApiMutation } from './useApiMutation'

/** Une ligne du formulaire de ticket (avant conversion en `SalePayload.items`). */
export type SaleLine = {
  productId: string
  productPriceId: string
  quantity: number
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
