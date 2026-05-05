import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ErpProductDetail from '~/components/Erp/ProductDetail.vue'

describe('ErpProductDetail — entête', () => {
  it('affiche eyebrow, titre du produit et sous-titre', async () => {
    const w = await mountSuspended(ErpProductDetail)
    expect(w.find('.eyebrow').text()).toBe('Fiche produit')
    expect(w.find('.sec-title').text()).toBe('Thon rouge entier')
    expect(w.find('.sec-sub').text()).toContain('POI-THO-001')
  })

  it('a l\'id product pour le scroll-spy', async () => {
    const w = await mountSuspended(ErpProductDetail)
    expect(w.find('#product').exists()).toBe(true)
  })

  it('expose deux actions principales (éditer, mouvement)', async () => {
    const w = await mountSuspended(ErpProductDetail)
    const actions = w.findAll('.sec-right .btn')
    expect(actions.length).toBe(2)
    expect(actions[0]!.text()).toContain('Mouvement')
    expect(actions[1]!.text()).toContain('Éditer')
  })
})

describe('ErpProductDetail — bloc résumé', () => {
  it('affiche les champs catégorie, statut, origine, référence', async () => {
    const w = await mountSuspended(ErpProductDetail)
    const summary = w.find('.product-summary')
    expect(summary.exists()).toBe(true)
    expect(summary.text()).toContain('Poissons frais')
    expect(summary.text()).toContain('Mareyeur Sète')
    expect(summary.text()).toContain('POI-THO-001')
  })

  it('affiche le badge de statut avec la classe is-active', async () => {
    const w = await mountSuspended(ErpProductDetail)
    const badge = w.find('.product-summary .badge')
    expect(badge.exists()).toBe(true)
    expect(badge.classes()).toContain('is-active')
    expect(badge.text()).toContain('Actif')
  })

  it('affiche la description du produit', async () => {
    const w = await mountSuspended(ErpProductDetail)
    expect(w.find('.product-description').exists()).toBe(true)
    expect(w.find('.product-description').text().length).toBeGreaterThan(20)
  })
})

describe('ErpProductDetail — bloc stock', () => {
  it('affiche le total, disponible, réservé et seuil', async () => {
    const w = await mountSuspended(ErpProductDetail)
    const stock = w.find('.product-stock-card')
    expect(stock.exists()).toBe(true)
    const items = stock.findAll('.stock-item')
    expect(items.length).toBe(4)
  })

  it('affiche les valeurs formatées en français', async () => {
    const w = await mountSuspended(ErpProductDetail)
    const stock = w.find('.product-stock-card')
    expect(stock.text()).toContain('32,4')
    expect(stock.text()).toContain('28,4')
    expect(stock.text()).toContain('4,0')
    expect(stock.text()).toContain('10,0')
  })

  it('affiche les libellés des items stock', async () => {
    const w = await mountSuspended(ErpProductDetail)
    const stock = w.find('.product-stock-card')
    const labels = stock.findAll('.stock-item-label').map(n => n.text())
    expect(labels).toEqual(['Stock total', 'Disponible', 'Réservé', 'Seuil bas'])
  })

  it('affiche une barre de progression du stock', async () => {
    const w = await mountSuspended(ErpProductDetail)
    expect(w.find('.stock-bar').exists()).toBe(true)
    expect(w.find('.stock-bar-fill').exists()).toBe(true)
  })
})

describe('ErpProductDetail — tableau des prix', () => {
  it('affiche un tableau avec entête', async () => {
    const w = await mountSuspended(ErpProductDetail)
    const table = w.find('.product-prices')
    expect(table.exists()).toBe(true)
    expect(table.find('table.tbl').exists()).toBe(true)
  })

  it('expose les colonnes Segment, Achat, Vente, Marge', async () => {
    const w = await mountSuspended(ErpProductDetail)
    const headers = w.findAll('.product-prices thead th').map(t => t.text())
    expect(headers).toEqual(['Segment', 'Achat', 'Vente', 'Marge'])
  })

  it('rend 4 lignes de prix par segment', async () => {
    const w = await mountSuspended(ErpProductDetail)
    const rows = w.findAll('.product-prices tbody tr')
    expect(rows.length).toBe(4)
  })

  it('chaque ligne affiche segment, achat, vente, marge', async () => {
    const w = await mountSuspended(ErpProductDetail)
    const first = w.findAll('.product-prices tbody tr')[0]!
    const cells = first.findAll('td')
    expect(cells[0]!.text()).toBe('Détail')
    expect(cells[1]!.text()).toContain('€/kg')
    expect(cells[2]!.text()).toContain('€/kg')
    expect(cells[3]!.text()).toContain('%')
  })
})
