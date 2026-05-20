import { useQueryClient } from '@tanstack/vue-query'
import type {
  Packaging,
  PackagingPayload,
  PackagingGet200Response,
} from '@tsanta22kyle/erp-client'
import { rawJson, useApiQuery } from './useApiQuery'
import { useApiMutation } from './useApiMutation'

type UpsertPackagingVars = { id: string; payload: PackagingPayload }

export function usePackaging() {
  return useApiQuery<PackagingGet200Response>(
    () => ['packaging'],
    (api) => rawJson(api.packaging.packagingGetRaw({ isActive: true })),
  )
}

export function useUpsertPackaging() {
  const queryClient = useQueryClient()

  return useApiMutation<Packaging, UpsertPackagingVars>(
    (api, vars) =>
      rawJson(
        api.packaging.packagingIdPutRaw({ id: vars.id, packagingPayload: vars.payload }),
      ),
    {
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['packaging'] })
      },
    },
  )
}
