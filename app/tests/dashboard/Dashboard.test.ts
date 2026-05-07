import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import ErpDashboard from '~/components/Erp/Dashboard.vue'

describe('ErpDashboard — entête', () => {
  it('affiche eyebrow, titre et action exporter', async () => {
    const w = await mountSuspended(ErpDashboard)
    expect(w.find('.eyebrow').text()).toBe('Aperçu')
    expect(w.find('.sec-title').text()).toBe('Tableau de bord')
    expect(w.text()).toContain('Exporter le rapport')
  })

  it('a l\'id dashboard pour le scroll-spy', async () => {
    const w = await mountSuspended(ErpDashboard)
    expect(w.find('#dashboard').exists()).toBe(true)
  })
})

describe('ErpDashboard — métriques API', () => {
  it('rend exactement 4 cartes de métriques', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    expect(w.findAll('.metric').length).toBe(4)
  })

  it('affiche les 4 labels attendus', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    const labels = w.findAll('.metric-label').map(el => el.text())
    expect(labels).toEqual([
      'Stock total',
      'Ventes du jour',
      'Produits actifs',
      'Transformations',
    ])
  })

  it('stock total calculé depuis /stock/summary (41,0 kg, 2 références)', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    const stock = w.findAll('.metric')[0]!
    expect(stock.find('.metric-num').text()).toBe('41,0')
    expect(stock.find('.metric-unit').text()).toBe('kg')
    expect(stock.find('.metric-hint').text()).toBe('2 références')
  })

  it('ventes agrégées depuis /sales (1 351 €, 12 tickets)', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    const sales = w.findAll('.metric')[1]!
    expect(sales.find('.metric-num').text()).toBe('1 351')
    expect(sales.find('.metric-unit').text()).toBe('€')
    expect(sales.find('.metric-hint').text()).toBe('12 tickets')
  })

  it('produits actifs depuis /products (14 / 15, 1 désactivé)', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    const prod = w.findAll('.metric')[2]!
    expect(prod.find('.metric-num').text()).toBe('14')
    expect(prod.find('.metric-unit').text()).toBe('/ 15')
    expect(prod.find('.metric-hint').text()).toBe('1 désactivé')
  })

  it('transformations depuis /transformations (7 lots)', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    const tr = w.findAll('.metric')[3]!
    expect(tr.find('.metric-num').text()).toBe('7')
    expect(tr.find('.metric-unit').text()).toBe('lots')
  })
})

describe('ErpDashboard — journal des mouvements', () => {
  it('affiche le titre du tableau', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    expect(w.find('.table-head').text()).toContain('Mouvements de stock récents')
  })

  it('rend les mouvements depuis /stock (2 par défaut, filtre Tous)', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    const rows = w.findAll('.tbl tbody tr')
    expect(rows.length).toBe(2)
  })

  it('expose 3 chips de filtre, Tous actif par défaut', async () => {
    const w = await mountSuspended(ErpDashboard)
    const chips = w.findAll('.chip')
    expect(chips).toHaveLength(3)
    expect(chips[0]!.text()).toBe('Tous')
    expect(chips[0]!.classes()).toContain('is-active')
  })

  it('filtre les entrées au clic sur Entrées (1 row)', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    const chips = w.findAll('.chip')
    await chips[1]!.trigger('click')
    const rows = w.findAll('.tbl tbody tr')
    expect(rows.length).toBe(1)
    expect(chips[1]!.classes()).toContain('is-active')
    expect(chips[0]!.classes()).not.toContain('is-active')
  })

  it('filtre les sorties au clic sur Sorties (1 row)', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    const chips = w.findAll('.chip')
    await chips[2]!.trigger('click')
    const rows = w.findAll('.tbl tbody tr')
    expect(rows.length).toBe(1)
  })

  it('affiche un mv-pill is-in pour les entrées et is-out pour les sorties', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    expect(w.find('.mv-pill.is-in').exists()).toBe(true)
    expect(w.find('.mv-pill.is-out').exists()).toBe(true)
  })
})

describe('ErpDashboard — colonnes du tableau', () => {
  it('contient les 6 colonnes attendues (sans Saisi par)', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    const headers = w.findAll('.tbl thead th').map(th => th.text())
    expect(headers).toEqual([
      'Produit', 'Type', 'Quantité', 'Poids', 'Origine', 'Date',
    ])
  })
})
