import { toValue, type MaybeRefOrGetter } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import type {
  CategoriesGet200Response,
  Product,
  ProductPayload,
  ProductPrice,
  ProductPricePayload,
  ProductsGet200Response,
  ProductStockSummary,
  ProductsIdPricesGet200Response,
} from '@tsanta22kyle/erp-client'
import { rawJson, useApiQuery } from './useApiQuery'
import { useApiMutation } from './useApiMutation'

type UpsertProductVars = { id: string; payload: ProductPayload }
type UpsertProductPriceVars = { id: string; payload: ProductPricePayload }
type DeleteProductPriceVars = { id: string; productId: string }

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

export function useUpsertProductPrice() {
  const queryClient = useQueryClient()

  return useApiMutation<ProductPrice, UpsertProductPriceVars>(
    (api, vars) =>
      rawJson(
        api.prices.pricesIdPutRaw({ id: vars.id, productPricePayload: vars.payload }),
      ),
    {
      onSettled: (_data: ProductPrice | undefined, _err: Error | null, vars: UpsertProductPriceVars) => {
        queryClient.invalidateQueries({ queryKey: ['product-prices', vars.payload.productId] })
        queryClient.invalidateQueries({ queryKey: ['product', vars.payload.productId] })
      },
    },
  )
}

export function useDeleteProductPrice() {
  const queryClient = useQueryClient()

  return useApiMutation<void, DeleteProductPriceVars>(
    async (api, vars) => {
      await api.prices.pricesIdDelete({ id: vars.id })
    },
    {
      onSettled: (_data: void, _err: Error | null, vars: DeleteProductPriceVars) => {
        queryClient.invalidateQueries({ queryKey: ['product-prices', vars.productId] })
        queryClient.invalidateQueries({ queryKey: ['product', vars.productId] })
      },
    },
  )
}
