import { useApiQuery } from './useApiQuery'

export function useTransformations() {
  return useApiQuery(
    () => ['transformations'],
    (api) => api.GET('/transformations', { params: { query: { limit: 50 } } }),
  )
}
