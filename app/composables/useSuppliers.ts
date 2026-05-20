import type { SuppliersGet200Response } from '@tsanta22kyle/erp-client'
import { rawJson, useApiQuery } from './useApiQuery'

export function useSuppliers() {
  return useApiQuery<SuppliersGet200Response>(
    () => ['suppliers'],
    (api) => rawJson(api.suppliers.suppliersGetRaw({ limit: 50 })),
  )
}
