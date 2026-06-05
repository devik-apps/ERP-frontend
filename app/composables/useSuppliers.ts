import { useQueryClient } from '@tanstack/vue-query'
import type {
  Supplier,
  SupplierPayload,
  SuppliersGet200Response,
} from '@tsanta22kyle/erp-client'
import { rawJson, useApiQuery } from './useApiQuery'
import { useApiMutation } from './useApiMutation'

type UpsertSupplierVars = { id: string; payload: SupplierPayload }

export function useSuppliers() {
  return useApiQuery<SuppliersGet200Response>(
    () => ['suppliers'],
    (api) => rawJson(api.suppliers.suppliersGetRaw({ limit: 50 })),
  )
}

export function useUpsertSupplier() {
  const queryClient = useQueryClient()

  return useApiMutation<Supplier, UpsertSupplierVars>(
    (api, vars) =>
      rawJson(
        api.suppliers.suppliersIdPutRaw({ id: vars.id, supplierPayload: vars.payload }),
      ),
    {
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      },
    },
  )
}
