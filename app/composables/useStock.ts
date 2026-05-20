import { useQueryClient } from '@tanstack/vue-query'
import type {
  StockGet200Response,
  StockMovement,
  StockMovementPayload,
} from '@tsanta22kyle/erp-client'
import { rawJson, useApiQuery } from './useApiQuery'
import { useApiMutation } from './useApiMutation'

type StockMutationVars = { id: string; payload: StockMovementPayload }
type StockMutationContext = { previousStock?: unknown; previousProducts?: unknown }

export function useStockMovements() {
  return useApiQuery<StockGet200Response>(
    () => ['stock'],
    (api) => rawJson(api.stock.stockGetRaw({ limit: 50 })),
  )
}

export function useCreateStockMovement() {
  const queryClient = useQueryClient()

  return useApiMutation<StockMovement, StockMutationVars>(
    (api, vars) =>
      rawJson(
        api.stock.stockIdPutRaw({ id: vars.id, stockMovementPayload: vars.payload }),
      ),
    {
      onMutate: async (vars: StockMutationVars) => {
        await queryClient.cancelQueries({ queryKey: ['stock'] })
        await queryClient.cancelQueries({ queryKey: ['products'] })

        const previousStock = queryClient.getQueryData(['stock'])
        const previousProducts = queryClient.getQueryData(['products'])

        queryClient.setQueryData(['stock'], (old: unknown) => {
          const o = old as { data?: StockMovement[]; meta?: unknown } | undefined
          if (!o?.data) return o
          const optimistic: StockMovement = {
            id: vars.id,
            type: vars.payload.type,
            product: { id: vars.payload.productId, label: '' },
            quantity: vars.payload.quantity,
            weightGrams: vars.payload.weightGrams ?? 0,
            origin: 'manual',
            isActive: true,
          }
          return { ...o, data: [optimistic, ...o.data] }
        })

        queryClient.setQueryData(['products'], (old: unknown) => {
          const o = old as { data?: { id?: string; currentStock?: number }[] } | undefined
          if (!o?.data) return o
          const deltaKg = (vars.payload.weightGrams ?? 0) / 1000
          const delta = vars.payload.type === 'entry' ? deltaKg : -deltaKg
          return {
            ...o,
            data: o.data.map((p) =>
              p.id === vars.payload.productId
                ? { ...p, currentStock: (p.currentStock ?? 0) + delta }
                : p,
            ),
          }
        })

        return { previousStock, previousProducts }
      },
      onError: (_err: Error, _vars: StockMutationVars, context: StockMutationContext | undefined) => {
        if (context?.previousStock !== undefined) queryClient.setQueryData(['stock'], context.previousStock)
        if (context?.previousProducts !== undefined) queryClient.setQueryData(['products'], context.previousProducts)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['stock'] })
        queryClient.invalidateQueries({ queryKey: ['products'] })
      },
    },
  )
}
