import { toValue, type MaybeRefOrGetter } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import type {
  CategoriesGet200Response,
  Product,
  ProductPayload,
  ProductsGet200Response,
  ProductStockSummary,
  ProductsIdPricesGet200Response,
} from '@tsanta22kyle/erp-client'
import { rawJson, useApiQuery } from './useApiQuery'
import { useApiMutation } from './useApiMutation'

type UpsertProductVars = { id: string; payload: ProductPayload }

export type ProductStatus = 'Actif' | 'Stock bas' | 'Inactif'

export const LOW_STOCK_THRESHOLD = 1.5

export function productStatus(p: { isActive?: boolean; currentStock?: number }): ProductStatus {
  if (!p.isActive) return 'Inactif'
  if ((p.currentStock ?? 0) < LOW_STOCK_THRESHOLD) return 'Stock bas'
  return 'Actif'
}

export function useCategories() {
  return useApiQuery<CategoriesGet200Response>(
    () => ['categories'],
    (api) => rawJson(api.categories.categoriesGetRaw({})),
  )
}

export function useProducts() {
  return useApiQuery<ProductsGet200Response>(
    () => ['products'],
    (api) => rawJson(api.products.productsGetRaw({ limit: 50 })),
  )
}

export function useProduct(id: MaybeRefOrGetter<string>) {
  return useApiQuery<Product>(
    () => ['product', toValue(id)],
    (api) => rawJson(api.products.productsIdGetRaw({ id: toValue(id) })),
  )
}

export function useProductStock(id: MaybeRefOrGetter<string>) {
  return useApiQuery<ProductStockSummary>(
    () => ['product-stock', toValue(id)],
    (api) => rawJson(api.products.productsIdStockGetRaw({ id: toValue(id) })),
  )
}

export function useProductPrices(id: MaybeRefOrGetter<string>) {
  return useApiQuery<ProductsIdPricesGet200Response>(
    () => ['product-prices', toValue(id)],
    (api) => rawJson(api.prices.productsIdPricesGetRaw({ id: toValue(id) })),
  )
}

export function useUpsertProduct() {
  const queryClient = useQueryClient()

  return useApiMutation<Product, UpsertProductVars>(
    (api, vars) =>
      rawJson(
        api.products.productsIdPutRaw({ id: vars.id, productPayload: vars.payload }),
      ),
    {
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['product'] })
      },
    },
  )
}
