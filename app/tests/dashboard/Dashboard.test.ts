import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
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

describe('ErpDashboard — métriques', () => {
  it('rend exactement 4 cartes de métriques', async () => {
    const w = await mountSuspended(ErpDashboard)
    expect(w.findAll('.metric').length).toBe(4)
  })

  it('affiche les 4 labels attendus', async () => {
    const w = await mountSuspended(ErpDashboard)
    const labels = w.findAll('.metric-label').map(el => el.text())
    expect(labels).toEqual([
      'Stock total',
      'Ventes du jour',
      'Produits actifs',
      'Transformations',
    ])
  })

  it('chaque métrique affiche valeur, unité, hint et delta', async () => {
    const w = await mountSuspended(ErpDashboard)
    const first = w.findAll('.metric')[0]!
    expect(first.find('.metric-num').text()).toBe('342,7')
    expect(first.find('.metric-unit').text()).toBe('kg')
    expect(first.find('.metric-hint').text()).toBe('15 références')
    expect(first.find('.metric-delta').text()).toBe('+12,4 kg vs hier')
  })

  it('marque les métriques up vs flat', async () => {
    const w = await mountSuspended(ErpDashboard)
    const deltas = w.findAll('.metric-delta')
    expect(deltas[0]!.classes()).toContain('is-up')
    expect(deltas[2]!.classes()).toContain('is-flat')
  })
})

describe('ErpDashboard — journal des mouvements', () => {
  it('affiche le titre et le sous-titre du tableau', async () => {
    const w = await mountSuspended(ErpDashboard)
    const head = w.find('.table-head')
    expect(head.text()).toContain('Mouvements de stock récents')
    expect(head.text()).toContain('11 dernières opérations')
  })

  it('rend les 11 mouvements par défaut (filtre Tous)', async () => {
    const w = await mountSuspended(ErpDashboard)
    const rows = w.findAll('.tbl tbody tr')
    expect(rows.length).toBe(11)
  })

  it('expose 3 chips de filtre, Tous actif par défaut', async () => {
    const w = await mountSuspended(ErpDashboard)
    const chips = w.findAll('.chip')
    expect(chips).toHaveLength(3)
    expect(chips[0]!.text()).toBe('Tous')
    expect(chips[0]!.classes()).toContain('is-active')
  })

  it('filtre les entrées au clic sur Entrées', async () => {
    const w = await mountSuspended(ErpDashboard)
    const chips = w.findAll('.chip')
    await chips[1]!.trigger('click')
    const rows = w.findAll('.tbl tbody tr')
    expect(rows.length).toBe(8)
    expect(chips[1]!.classes()).toContain('is-active')
    expect(chips[0]!.classes()).not.toContain('is-active')
  })

  it('filtre les sorties au clic sur Sorties', async () => {
    const w = await mountSuspended(ErpDashboard)
    const chips = w.findAll('.chip')
    await chips[2]!.trigger('click')
    const rows = w.findAll('.tbl tbody tr')
    expect(rows.length).toBe(3)
  })

  it('affiche un mv-pill is-in pour les entrées et is-out pour les sorties', async () => {
    const w = await mountSuspended(ErpDashboard)
    expect(w.find('.mv-pill.is-in').exists()).toBe(true)
    expect(w.find('.mv-pill.is-out').exists()).toBe(true)
  })
})

describe('ErpDashboard — colonnes du tableau', () => {
  it('contient les 7 colonnes attendues', async () => {
    const w = await mountSuspended(ErpDashboard)
    const headers = w.findAll('.tbl thead th').map(th => th.text())
    expect(headers).toEqual([
      'Produit', 'Type', 'Quantité', 'Poids', 'Origine', 'Date', 'Saisi par',
    ])
  })
})
