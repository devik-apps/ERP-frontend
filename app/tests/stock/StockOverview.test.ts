import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { server } from '~/tests/mocks/server'
import ErpStockOverview from '~/components/Erp/StockOverview.vue'

async function mount() {
  const w = await mountSuspended(ErpStockOverview)
  await flushPromises()
  await w.vm.$nextTick()
  return w
}

describe('ErpStockOverview — entête', () => {
  it('affiche eyebrow, titre et sous-titre', async () => {
    const w = await mount()
    expect(w.find('.eyebrow').text()).toBe('Stock')
    expect(w.find('.sec-title').text()).toBe('État du stock')
    expect(w.find('.sec-sub').exists()).toBe(true)
  })

  it("n'expose aucun bouton d'action ni formulaire (lecture seule)", async () => {
    const w = await mount()
    expect(w.find('form').exists()).toBe(false)
    expect(w.find('button[type="submit"]').exists()).toBe(false)
    expect(w.find('select[name="product"]').exists()).toBe(false)
    expect(w.find('.sec-right .btn').exists()).toBe(false)
  })
})

describe('ErpStockOverview — stock par produit', () => {
  it('affiche une ligne par produit', async () => {
    const w = await mount()
    const rows = w.findAll('[data-table="stock"] tbody tr')
    expect(rows.length).toBe(15)
  })

  it('expose les colonnes Produit, Catégorie, Stock, Statut', async () => {
    const w = await mount()
    const headers = w.findAll('[data-table="stock"] thead th').map(t => t.text())
    expect(headers).toEqual(['Produit', 'Catégorie', 'Stock', 'Statut'])
  })

  it('affiche le statut sous forme de badge', async () => {
    const w = await mount()
    const firstRow = w.find('[data-table="stock"] tbody tr')
    expect(firstRow.find('.badge').exists()).toBe(true)
  })
})

describe('ErpStockOverview — mouvements récents', () => {
  it('affiche le journal des mouvements', async () => {
    const w = await mount()
    const rows = w.findAll('[data-table="movements"] tbody tr')
    expect(rows.length).toBe(2)
  })

  it('affiche un pill de type pour chaque mouvement', async () => {
    const w = await mount()
    expect(w.find('[data-table="movements"] .mv-pill').exists()).toBe(true)
  })
})

describe('ErpStockOverview — jonction stock (forme backend réel)', () => {
  it('affiche le stock depuis /stock/summary même si currentStock vaut 0', async () => {
    server.use(
      http.get('https://api.erp.local/v1/products', () =>
        HttpResponse.json({
          data: [{ id: 'p1', label: 'Thon', category: { id: 'c1', label: 'Frais' }, isActive: true, currentStock: 0 }],
          meta: { total: 1, page: 1, limit: 50, totalPages: 1 },
        }),
      ),
      http.get('https://api.erp.local/v1/stock/summary', () =>
        HttpResponse.json({
          data: [{ productId: 'p1', totalQuantity: 25, totalWeightGrams: 13500, lastMovementAt: '2026-06-01T00:00:00Z' }],
        }),
      ),
    )
    const w = await mount()
    const row = w.find('[data-table="stock"] tbody tr')
    expect(row.find('.num').text()).toContain('13,5')
  })

  it('résout le libellé produit des mouvements depuis productId', async () => {
    server.use(
      http.get('https://api.erp.local/v1/products', () =>
        HttpResponse.json({
          data: [{ id: 'p1', label: 'Thon', category: { id: 'c1', label: 'Frais' }, isActive: true, currentStock: 0 }],
          meta: { total: 1, page: 1, limit: 50, totalPages: 1 },
        }),
      ),
      http.get('https://api.erp.local/v1/stock', () =>
        HttpResponse.json({
          data: [{ id: 'm1', type: 'entry', productId: 'p1', quantity: 10, weightGrams: 5000, origin: 'manual', isActive: true }],
          meta: { total: 1, page: 1, limit: 50, totalPages: 1 },
        }),
      ),
    )
    const w = await mount()
    const row = w.find('[data-table="movements"] tbody tr')
    expect(row.find('.strong').text()).toBe('Thon')
  })
})
