import { useApiQuery } from './useApiQuery'

export function useSuppliers() {
  return useApiQuery(
    () => ['suppliers'],
    (api) => api.GET('/suppliers', { params: { query: { limit: 50 } } }),
  )
}
