import type {
  StockSummaryGet200Response,
  TransformationsGet200Response,
} from '@tsanta22kyle/erp-client'
import { rawJson, useApiQuery } from './useApiQuery'

export function useStockSummary() {
  return useApiQuery<StockSummaryGet200Response>(
    () => ['stock', 'summary'],
    (api) => rawJson(api.stock.stockSummaryGetRaw({})),
  )
}

export function useTransformationCount() {
  return useApiQuery<TransformationsGet200Response>(
    () => ['transformations'],
    (api) => rawJson(api.transformations.transformationsGetRaw({ limit: 1 })),
  )
}
