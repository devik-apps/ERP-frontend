import { useApiQuery } from './useApiQuery'

export function useStockSummary() {
  return useApiQuery(
    () => ['stock', 'summary'],
    (api) => api.GET('/stock/summary'),
  )
}

export function useTransformationCount() {
  return useApiQuery(
    () => ['transformations'],
    (api) => api.GET('/transformations', { params: { query: { limit: 1 } } }),
  )
}
