import type {
  StockSummaryGet200Response,
  TransformationsGet200Response,
} from '@tsanta22kyle/erp-client'
import { computed } from 'vue'
import { rawJson, useApiQuery } from './useApiQuery'
import { useSales } from './useSales'

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

export interface SalesDayPoint {
  date: string
  revenue: number
}

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10)
}

/**
 * Agrège le CA quotidien sur 7 jours glissants. Le dernier point est ancré sur
 * la vente la plus récente (et non sur `new Date()`), pour que la série reste
 * lisible même quand les données sont historiques (mocks de dev, démos).
 */
export function useSalesByDay() {
  const { data } = useSales()
  return computed<SalesDayPoint[]>(() => {
    const sales = data.value?.data ?? []
    if (!sales.length) return []

    const times = sales
      .map(s => (s.saleDate ? new Date(s.saleDate).getTime() : NaN))
      .filter(t => !Number.isNaN(t))
    if (!times.length) return []

    const anchor = new Date(Math.max(...times))
    anchor.setUTCHours(0, 0, 0, 0)

    const buckets: SalesDayPoint[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(anchor)
      d.setUTCDate(anchor.getUTCDate() - i)
      buckets.push({ date: isoDay(d), revenue: 0 })
    }

    const byDate = new Map(buckets.map(b => [b.date, b]))
    for (const s of sales) {
      if (!s.saleDate) continue
      const key = isoDay(new Date(s.saleDate))
      const bucket = byDate.get(key)
      if (bucket) bucket.revenue += (s.totalAmount ?? 0)
    }

    return buckets
  })
}
