import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { server } from '~/tests/mocks/server'
import ErpSales from '~/components/Erp/Sales.vue'

describe('ErpSales -- entete', () => {
  it('affiche eyebrow, titre et sous-titre', async () => {
    const w = await mountSuspended(ErpSales)
    expect(w.find('.eyebrow').text()).toBe('Ventes')
    expect(w.find('.sec-title').text()).toContain('commerciale')
    expect(w.find('.sec-sub').exists()).toBe(true)
  })

  it("a l'id sales pour le scroll-spy", async () => {
    const w = await mountSuspended(ErpSales)
    expect(w.find('#sales').exists()).toBe(true)
  })

  it('expose une action principale Nouveau ticket', async () => {
    const w = await mountSuspended(ErpSales)
    expect(w.text()).toContain('Nouveau ticket')
  })
})

describe('ErpSales -- metriques', () => {
  it('rend exactement 4 cartes de metriques', async () => {
    const w = await mountSuspended(ErpSales)
    expect(w.findAll('.metric').length).toBe(4)
  })

  it('affiche les 4 labels attendus (champs réels uniquement)', async () => {
    const w = await mountSuspended(ErpSales)
    const labels = w.findAll('.metric-label').map(el => el.text())
    expect(labels[0]).toContain('affaires')
    expect(labels[1]).toContain('Tickets')
    expect(labels[2]).toContain('Panier')
    expect(labels[3]).toContain('Articles')
  })

  it('affiche les valeurs agrégées depuis /sales', async () => {
    const w = await mountSuspended(ErpSales)
    await flushPromises()
    await w.vm.$nextTick()
    const nums = w.findAll('.metric-num').map(el => el.text())
    expect(nums[0]).toBe('135 110')
    expect(nums[1]).toBe('12')
    expect(nums[2]).toBe('11 259')
    expect(nums[3]).toBe('51')
  })

  it('les KPIs valent 0 quand /sales renvoie un tableau vide', async () => {
    server.use(
      http.get('https://api.erp.local/v1/sales', () =>
        HttpResponse.json({ data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 0 } }),
      ),
    )
    const w = await mountSuspended(ErpSales)
    await flushPromises()
    await w.vm.$nextTick()
    const nums = w.findAll('.metric-num').map(el => el.text())
    expect(nums[0]).toBe('0')
    expect(nums[1]).toBe('0')
    expect(nums[2]).toBe('0')
    expect(nums[3]).toBe('0')
  })
})

describe('ErpSales -- filtres par statut', () => {
  it('expose 3 chips de filtre, Tous actif par defaut', async () => {
    const w = await mountSuspended(ErpSales)
    await flushPromises()
    await w.vm.$nextTick()
    const chips = w.findAll('[data-filter="status"] .chip')
    expect(chips).toHaveLength(3)
    const labels = chips.map(c => c.text())
    expect(labels).toEqual(['Tous', 'Actif', 'Inactif'])
    expect(chips[0]!.classes()).toContain('is-active')
  })

  it('le filtre Actif réduit à 11 lignes', async () => {
    const w = await mountSuspended(ErpSales)
    await flushPromises()
    await w.vm.$nextTick()
    await w.find('[data-filter="status"] .chip:nth-child(2)').trigger('click')
    expect(w.findAll('.tbl tbody tr').length).toBe(11)
  })

  it('le filtre Inactif réduit à 1 ligne', async () => {
    const w = await mountSuspended(ErpSales)
    await flushPromises()
    await w.vm.$nextTick()
    const chips = w.findAll('[data-filter="status"] .chip')
    const inactif = chips.find(c => c.text() === 'Inactif')
    await inactif!.trigger('click')
    expect(w.findAll('.tbl tbody tr').length).toBe(1)
  })
})

describe('ErpSales -- journal des tickets', () => {
  it('affiche le titre du tableau', async () => {
    const w = await mountSuspended(ErpSales)
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.table-head').text()).toContain('Tickets')
  })

  it('rend les 12 tickets par defaut (filtre Tous)', async () => {
    const w = await mountSuspended(ErpSales)
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.findAll('.tbl tbody tr').length).toBe(12)
  })

  it('contient les 5 colonnes (champs réels)', async () => {
    const w = await mountSuspended(ErpSales)
    const headers = w.findAll('.tbl thead th')
    expect(headers).toHaveLength(5)
    expect(headers[2]!.text()).toBe('Articles')
    expect(headers[3]!.text()).toBe('Montant')
  })

  it('affiche un badge is-active pour les ventes actives', async () => {
    const w = await mountSuspended(ErpSales)
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.badge.is-active').exists()).toBe(true)
  })

  it('affiche un badge is-inactive pour les ventes inactives', async () => {
    const w = await mountSuspended(ErpSales)
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.badge.is-inactive').exists()).toBe(true)
  })
})

describe('ErpSales — création de ticket', () => {
  it('le clic sur "Nouveau ticket" ouvre la modale', async () => {
    const w = await mountSuspended(ErpSales)
    expect(w.find('.modal').exists()).toBe(false)
    const btn = w.findAll('.sec-right .btn').find(b => b.text().includes('Nouveau ticket'))
    await btn!.trigger('click')
    await w.vm.$nextTick()
    expect(w.find('.modal').exists()).toBe(true)
    expect(w.find('.modal-title').text()).toContain('Nouveau ticket')
  })
})

describe('ErpSales — état vide', () => {
  it('affiche une ligne "Aucun ticket" quand /sales renvoie un tableau vide', async () => {
    server.use(
      http.get('https://api.erp.local/v1/sales', () =>
        HttpResponse.json({ data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 0 } }),
      ),
    )
    const w = await mountSuspended(ErpSales)
    await flushPromises()
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.tbl tbody tr.is-empty').text()).toContain('Aucun ticket')
  })
})
