import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useStockSummary, useTransformationCount, useSalesByDay } from '~/composables/useDashboard'
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

describe('useSalesByDay', () => {
  it('retourne 7 entrées (7 derniers jours)', async () => {
    const stub = defineComponent({
      setup() { return { series: useSalesByDay() } },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await flushPromises()
    const series = (w.vm as any).series
    expect(series).toHaveLength(7)
  })

  it('chaque entrée contient { date, revenue }', async () => {
    const stub = defineComponent({
      setup() { return { series: useSalesByDay() } },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await flushPromises()
    const series = (w.vm as any).series
    for (const point of series) {
      expect(point).toHaveProperty('date')
      expect(point).toHaveProperty('revenue')
      expect(typeof point.revenue).toBe('number')
    }
  })

  it('le dernier point correspond au jour de la vente la plus récente (2026-05-04)', async () => {
    const stub = defineComponent({
      setup() { return { series: useSalesByDay() } },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await flushPromises()
    const series = (w.vm as any).series
    expect(series[6].date).toBe('2026-05-04')
  })

  it('le premier point est 6 jours avant le dernier (2026-04-28)', async () => {
    const stub = defineComponent({
      setup() { return { series: useSalesByDay() } },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await flushPromises()
    const series = (w.vm as any).series
    expect(series[0].date).toBe('2026-04-28')
  })

  it('CA du 2026-05-04 = 33 970 Ar (somme des 5 ventes du jour)', async () => {
    const stub = defineComponent({
      setup() { return { series: useSalesByDay() } },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await flushPromises()
    const series = (w.vm as any).series
    expect(series[6].revenue).toBeCloseTo(33970, 2)
  })

  it('CA du 2026-05-03 = 101 140 Ar (somme des 7 ventes du jour)', async () => {
    const stub = defineComponent({
      setup() { return { series: useSalesByDay() } },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await flushPromises()
    const series = (w.vm as any).series
    expect(series[5].revenue).toBeCloseTo(101140, 2)
  })

  it('les jours sans vente sont à 0 Ar', async () => {
    const stub = defineComponent({
      setup() { return { series: useSalesByDay() } },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await flushPromises()
    const series = (w.vm as any).series
    expect(series[0].revenue).toBe(0)
    expect(series[1].revenue).toBe(0)
    expect(series[2].revenue).toBe(0)
    expect(series[3].revenue).toBe(0)
    expect(series[4].revenue).toBe(0)
  })
})
