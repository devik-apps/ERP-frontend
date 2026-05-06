import { toValue, type MaybeRefOrGetter } from 'vue'
import { useApiQuery } from './useApiQuery'

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
