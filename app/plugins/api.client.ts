import {
  Configuration,
  CategoriesApi,
  ProductsApi,
  PricesApi,
  StockApi,
  SalesApi,
  SuppliersApi,
  TransformationsApi,
} from '@tsanta22kyle/erp-client'

export type ErpApi = {
  configuration: Configuration
  categories: CategoriesApi
  products: ProductsApi
  prices: PricesApi
  stock: StockApi
  sales: SalesApi
  suppliers: SuppliersApi
  transformations: TransformationsApi
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const configuration = new Configuration({
    basePath: config.public.apiBase as string,
  })

  const api: ErpApi = {
    configuration,
    categories: new CategoriesApi(configuration),
    products: new ProductsApi(configuration),
    prices: new PricesApi(configuration),
    stock: new StockApi(configuration),
    sales: new SalesApi(configuration),
    suppliers: new SuppliersApi(configuration),
    transformations: new TransformationsApi(configuration),
  }

  return {
    provide: { api },
  }
})
