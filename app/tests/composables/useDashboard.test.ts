import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useStockSummary, useTransformationCount } from '~/composables/useDashboard'
import { MOCK_STOCK_SUMMARY, MOCK_TRANSFORMATIONS } from '../mocks/handlers'

describe('useStockSummary', () => {
  it('retourne les données depuis GET /stock/summary', async () => {
    const stub = defineComponent({
      setup() { return useStockSummary() },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await flushPromises()
    const data = (w.vm as any).data
    expect(data?.data).toHaveLength(MOCK_STOCK_SUMMARY.length)
  })

  it('le premier résultat correspond au premier élément du mock', async () => {
    const stub = defineComponent({
      setup() { return useStockSummary() },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await flushPromises()
    const first = (w.vm as any).data?.data?.[0]
    expect(first?.product?.id).toBe(MOCK_STOCK_SUMMARY[0]!.product.id)
    expect(first?.totalWeightGrams).toBe(MOCK_STOCK_SUMMARY[0]!.totalWeightGrams)
  })

  it('totalWeightGrams somme les deux références mock', async () => {
    const stub = defineComponent({
      setup() { return useStockSummary() },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await flushPromises()
    const items = (w.vm as any).data?.data ?? []
    const total = items.reduce((acc: number, s: any) => acc + (s.totalWeightGrams ?? 0), 0)
    expect(total).toBe(41000)
  })
})

describe('useTransformationCount', () => {
  it('retourne le meta.total depuis GET /transformations', async () => {
    const stub = defineComponent({
      setup() { return useTransformationCount() },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await flushPromises()
    const data = (w.vm as any).data
    expect(data?.meta?.total).toBe(7)
  })

  it('expose les données de transformation', async () => {
    const stub = defineComponent({
      setup() { return useTransformationCount() },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await flushPromises()
    const items = (w.vm as any).data?.data
    expect(items).toHaveLength(MOCK_TRANSFORMATIONS.length)
  })
})
