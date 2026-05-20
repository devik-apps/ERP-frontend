import { toValue, type MaybeRefOrGetter } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useApiQuery } from './useApiQuery'
import { useApiMutation } from './useApiMutation'
import type { components } from '~/api/types.gen'

type Product = components['schemas']['Product']
type ProductPayload = components['schemas']['ProductPayload']
type UpsertProductVars = { id: string; payload: ProductPayload }

export type ProductStatus = 'Actif' | 'Stock bas' | 'Inactif'

export const LOW_STOCK_THRESHOLD = 1.5

export function productStatus(p: { isActive?: boolean; currentStock?: number }): ProductStatus {
  if (!p.isActive) return 'Inactif'
  if ((p.currentStock ?? 0) < LOW_STOCK_THRESHOLD) return 'Stock bas'
  return 'Actif'
}

export function useCategories() {
  return useApiQuery(
    () => ['categories'],
    (api) => api.GET('/categories', {}),
  )
}

export function useProducts() {
  return useApiQuery(
    () => ['products'],
    (api) => api.GET('/products', { params: { query: { limit: 50 } } }),
  )
}

export function useProduct(id: MaybeRefOrGetter<string>) {
  return useApiQuery(
    () => ['product', toValue(id)],
    (api) => api.GET('/products/{id}', { params: { path: { id: toValue(id) } } }),
  )
}

export function useProductStock(id: MaybeRefOrGetter<string>) {
  return useApiQuery(
    () => ['product-stock', toValue(id)],
    (api) => api.GET('/products/{id}/stock', { params: { path: { id: toValue(id) } } }),
  )
}

export function useProductPrices(id: MaybeRefOrGetter<string>) {
  return useApiQuery(
    () => ['product-prices', toValue(id)],
    (api) => api.GET('/products/{id}/prices', { params: { path: { id: toValue(id) } } }),
  )
}

export function useUpsertProduct() {
  const queryClient = useQueryClient()

  return useApiMutation<Product, UpsertProductVars>(
    (api, vars) =>
      api.PUT('/products/{id}', {
        params: { path: { id: vars.id } },
        body: vars.payload,
      }),
    {
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['product'] })
      },
    },
  )
}
