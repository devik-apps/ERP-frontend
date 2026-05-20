import type { PackagingGet200Response } from '@tsanta22kyle/erp-client'
import { rawJson, useApiQuery } from './useApiQuery'

export function usePackaging() {
  return useApiQuery<PackagingGet200Response>(
    () => ['packaging'],
    (api) => rawJson(api.packaging.packagingGetRaw({ isActive: true })),
  )
}
