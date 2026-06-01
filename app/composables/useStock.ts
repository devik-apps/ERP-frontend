import { computed } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import type {
  StockGet200Response,
  StockMovement,
  StockMovementPayload,
} from '@tsanta22kyle/erp-client'
import { rawJson, useApiQuery } from './useApiQuery'
import { useApiMutation } from './useApiMutation'
import { useProducts } from './useProducts'
import { useStockSummary } from './useDashboard'

type StockMutationVars = { id: string; payload: StockMovementPayload }
type StockMutationContext = { previousStock?: unknown; previousProducts?: unknown }

export function useStockMovements() {
  return useApiQuery<StockGet200Response>(
    () => ['stock'],
    (api) => rawJson(api.stock.stockGetRaw({ limit: 50 })),
  )
}

/**
 * Le stock réel n'est PAS porté par `product.currentStock` (le backend le
 * renvoie à 0), mais par l'endpoint `/stock/summary`, agrégé par `productId`.
 * On joint donc le résumé sur la liste produits et on expose `currentStock`
 * en kg (= totalWeightGrams / 1000). Clé tolérante (`productId` réel ou
 * `product.id` des mocks) ; à défaut de résumé, on garde la valeur produit.
 */
function summaryProductId(s: Record<string, any>): string | undefined {
  return s.productId ?? s.product?.id
}

export function useProductsWithStock() {
  const productsQ = useProducts()
  const summaryQ = useStockSummary()

  const products = computed(() => {
    const byId = new Map<string, Record<string, any>>()
    for (const s of (summaryQ.data.value?.data ?? []) as Record<string, any>[]) {
      const id = summaryProductId(s)
      if (id) byId.set(id, s)
    }
    return (productsQ.data.value?.data ?? []).map((p) => {
      const s = p.id ? byId.get(p.id) : undefined
      return s ? { ...p, currentStock: (s.totalWeightGrams ?? 0) / 1000 } : p
    })
  })

  return { products, productsQ, summaryQ }
}

/**
 * Les mouvements renvoyés par le backend ne portent que `productId` (pas
 * d'objet `product` imbriqué). On résout le libellé produit via la liste des
 * produits. Tolérant au `product` déjà présent (mocks).
 */
export function useEnrichedMovements() {
  const movementsQ = useStockMovements()
  const productsQ = useProducts()

  const movements = computed(() => {
    const labels = new Map<string, string>()
    for (const p of productsQ.data.value?.data ?? []) {
      if (p.id) labels.set(p.id, p.label ?? '')
    }
    return ((movementsQ.data.value?.data ?? []) as Record<string, any>[]).map((m) => {
      if (m.product) return m
      const id = m.productId as string | undefined
      return { ...m, product: id ? { id, label: labels.get(id) ?? '' } : undefined }
    })
  })

  return { movements, movementsQ, productsQ }
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
