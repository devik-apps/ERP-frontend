import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ErpSales from '~/components/Erp/Sales.vue'

describe('ErpSales — entête', () => {
  it('affiche eyebrow, titre et sous-titre', async () => {
    const w = await mountSuspended(ErpSales)
    expect(w.find('.eyebrow').text()).toBe('Ventes')
    expect(w.find('.sec-title').text()).toBe('Activité commerciale')
    expect(w.find('.sec-sub').exists()).toBe(true)
  })

  it('a l\'id sales pour le scroll-spy', async () => {
    const w = await mountSuspended(ErpSales)
    expect(w.find('#sales').exists()).toBe(true)
  })

  it('expose une action principale Nouveau ticket', async () => {
    const w = await mountSuspended(ErpSales)
    expect(w.text()).toContain('Nouveau ticket')
  })
})

describe('ErpSales — métriques', () => {
  it('rend exactement 4 cartes de métriques', async () => {
    const w = await mountSuspended(ErpSales)
    expect(w.findAll('.metric').length).toBe(4)
  })

  it('affiche les 4 labels attendus', async () => {
    const w = await mountSuspended(ErpSales)
    const labels = w.findAll('.metric-label').map(el => el.text())
    expect(labels).toEqual([
      'Chiffre d\'affaires',
      'Tickets émis',
      'Panier moyen',
      'Segment principal',
    ])
  })

  it('affiche les valeurs principales', async () => {
    const w = await mountSuspended(ErpSales)
    const nums = w.findAll('.metric-num').map(el => el.text())
    expect(nums[0]).toBe('1 248')
    expect(nums[1]).toBe('34')
    expect(nums[2]).toBe('36,70')
    expect(nums[3]).toBe('62')
  })
})

describe('ErpSales — filtres par segment', () => {
  it('expose 5 chips de filtre, Tous actif par défaut', async () => {
    const w = await mountSuspended(ErpSales)
    const chips = w.findAll('.chip')
    expect(chips).toHaveLength(5)
    const labels = chips.map(c => c.text())
    expect(labels).toEqual(['Tous', 'Comptoir', 'Pro', 'Restaurant', 'Gros'])
    expect(chips[0]!.classes()).toContain('is-active')
  })

  it('filtre les ventes Comptoir au clic', async () => {
    const w = await mountSuspended(ErpSales)
    const chips = w.findAll('.chip')
    await chips[1]!.trigger('click')
    expect(chips[1]!.classes()).toContain('is-active')
    expect(chips[0]!.classes()).not.toContain('is-active')
    expect(w.findAll('.tbl tbody tr').length).toBe(6)
  })

  it('filtre les ventes Pro au clic', async () => {
    const w = await mountSuspended(ErpSales)
    const chips = w.findAll('.chip')
    await chips[2]!.trigger('click')
    expect(w.findAll('.tbl tbody tr').length).toBe(2)
  })

  it('filtre les ventes Restaurant au clic', async () => {
    const w = await mountSuspended(ErpSales)
    const chips = w.findAll('.chip')
    await chips[3]!.trigger('click')
    expect(w.findAll('.tbl tbody tr').length).toBe(3)
  })

  it('filtre les ventes Gros au clic', async () => {
    const w = await mountSuspended(ErpSales)
    const chips = w.findAll('.chip')
    await chips[4]!.trigger('click')
    expect(w.findAll('.tbl tbody tr').length).toBe(1)
  })
})

describe('ErpSales — journal des tickets', () => {
  it('affiche le titre et le sous-titre du tableau', async () => {
    const w = await mountSuspended(ErpSales)
    const head = w.find('.table-head')
    expect(head.text()).toContain('Tickets récents')
    expect(head.text()).toContain('12 dernières ventes')
  })

  it('rend les 12 tickets par défaut (filtre Tous)', async () => {
    const w = await mountSuspended(ErpSales)
    const rows = w.findAll('.tbl tbody tr')
    expect(rows.length).toBe(12)
  })

  it('contient les 7 colonnes attendues', async () => {
    const w = await mountSuspended(ErpSales)
    const headers = w.findAll('.tbl thead th').map(th => th.text())
    expect(headers).toEqual([
      'N°', 'Heure', 'Segment', 'Produit principal', 'Articles', 'Montant', 'Statut',
    ])
  })

  it('affiche un badge is-active pour les ventes payées', async () => {
    const w = await mountSuspended(ErpSales)
    expect(w.find('.badge.is-active').exists()).toBe(true)
  })

  it('affiche un badge is-low pour les ventes en attente', async () => {
    const w = await mountSuspended(ErpSales)
    expect(w.find('.badge.is-low').exists()).toBe(true)
  })

  it('affiche un badge is-inactive pour les ventes annulées', async () => {
    const w = await mountSuspended(ErpSales)
    expect(w.find('.badge.is-inactive').exists()).toBe(true)
  })
})
