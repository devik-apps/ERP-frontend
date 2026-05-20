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

describe('ErpStockOverview — état API hors-ligne', () => {
  it('affiche un bandeau "API indisponible" quand /products échoue', async () => {
    server.use(
      http.get('https://api.erp.local/v1/products', () => HttpResponse.error()),
    )
    const w = await mount()
    await flushPromises()
    expect(w.find('.api-state.is-error').exists()).toBe(true)
  })
})
