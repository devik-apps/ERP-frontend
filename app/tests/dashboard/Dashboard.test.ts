import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { server } from '~/tests/mocks/server'
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

describe('ErpDashboard — état API hors-ligne', () => {
  it('affiche un bandeau "API indisponible" quand /stock/summary échoue', async () => {
    server.use(
      http.get('https://api.erp.local/v1/stock/summary', () =>
        HttpResponse.error(),
      ),
    )
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    await flushPromises()
    await w.vm.$nextTick()
    const banner = w.find('.api-state.is-error')
    expect(banner.exists()).toBe(true)
    expect(banner.text()).toContain('API indisponible')
  })

  it('affiche une ligne "Aucun mouvement" quand /stock renvoie un tableau vide', async () => {
    server.use(
      http.get('https://api.erp.local/v1/stock', () =>
        HttpResponse.json({ data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 0 } }),
      ),
    )
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.tbl tbody tr.is-empty').text()).toContain('Aucun mouvement')
  })
})

describe('ErpDashboard — graphique CA 7 jours', () => {
  it('affiche une carte « Chiffre d\'affaires » avec le sous-titre 7 derniers jours', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    const card = w.find('.sales-chart-card')
    expect(card.exists()).toBe(true)
    expect(card.text()).toContain("Chiffre d'affaires")
    expect(card.text()).toContain('7 derniers jours')
  })

  it('rend un conteneur de graphique dans la carte CA', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    expect(w.find('.sales-chart-card .sales-chart').exists()).toBe(true)
  })

  it('affiche le total CA cumulé sur les 7 jours (1 351,10 €)', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    const card = w.find('.sales-chart-card')
    expect(card.find('.sales-chart-total').text()).toContain('1 351,10')
  })
})

describe('ErpDashboard — colonnes du tableau', () => {
  it('contient les 5 colonnes attendues (sans Saisi par ni Date)', async () => {
    const w = await mountSuspended(ErpDashboard)
    await flushPromises()
    const headers = w.findAll('.tbl thead th').map(th => th.text())
    expect(headers).toEqual([
      'Produit', 'Type', 'Quantité', 'Poids', 'Origine',
    ])
  })
})
