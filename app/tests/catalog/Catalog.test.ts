import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ErpCatalog from '~/components/Erp/Catalog.vue'

describe('ErpCatalog — entête', () => {
  it('affiche eyebrow, titre et sous-titre', async () => {
    const w = await mountSuspended(ErpCatalog)
    expect(w.find('.eyebrow').text()).toBe('Produits')
    expect(w.find('.sec-title').text()).toBe('Catalogue')
    expect(w.text()).toContain('15 références')
  })

  it('a l\'id catalog pour le scroll-spy', async () => {
    const w = await mountSuspended(ErpCatalog)
    expect(w.find('#catalog').exists()).toBe(true)
  })
})

describe('ErpCatalog — recherche et filtres', () => {
  it('expose un champ de recherche', async () => {
    const w = await mountSuspended(ErpCatalog)
    const input = w.find('input[type="search"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBeTruthy()
  })

  it('filtre les produits par texte saisi', async () => {
    const w = await mountSuspended(ErpCatalog)
    const input = w.find('input[type="search"]')
    await input.setValue('saumon')
    const cards = w.findAll('.product-card')
    expect(cards.length).toBe(3)
  })

  it('expose les chips de catégorie (Toutes + 5 catégories)', async () => {
    const w = await mountSuspended(ErpCatalog)
    const chips = w.findAll('[data-filter="category"] .chip')
    expect(chips).toHaveLength(6)
    expect(chips[0]!.text()).toBe('Toutes')
    expect(chips[0]!.classes()).toContain('is-active')
  })

  it('filtre par catégorie au clic', async () => {
    const w = await mountSuspended(ErpCatalog)
    const chips = w.findAll('[data-filter="category"] .chip')
    const coquillages = chips.find(c => c.text() === 'Coquillages')!
    await coquillages.trigger('click')
    const cards = w.findAll('.product-card')
    expect(cards.length).toBe(3)
    expect(coquillages.classes()).toContain('is-active')
  })

  it('expose les chips de statut (Tous + 3 statuts)', async () => {
    const w = await mountSuspended(ErpCatalog)
    const chips = w.findAll('[data-filter="status"] .chip')
    expect(chips).toHaveLength(4)
    expect(chips[0]!.text()).toBe('Tous')
    expect(chips[0]!.classes()).toContain('is-active')
  })

  it('filtre par statut Stock bas', async () => {
    const w = await mountSuspended(ErpCatalog)
    const chips = w.findAll('[data-filter="status"] .chip')
    const low = chips.find(c => c.text() === 'Stock bas')!
    await low.trigger('click')
    const cards = w.findAll('.product-card')
    expect(cards.length).toBe(1)
  })

  it('combine recherche, catégorie et statut', async () => {
    const w = await mountSuspended(ErpCatalog)
    const input = w.find('input[type="search"]')
    await input.setValue('thon')
    const cat = w.findAll('[data-filter="category"] .chip').find(c => c.text() === 'Préparations')!
    await cat.trigger('click')
    const cards = w.findAll('.product-card')
    expect(cards.length).toBe(1)
    expect(cards[0]!.text()).toContain('Tartare de thon')
  })

  it('affiche un message vide si aucun produit ne matche', async () => {
    const w = await mountSuspended(ErpCatalog)
    await w.find('input[type="search"]').setValue('xyzxyz')
    expect(w.findAll('.product-card').length).toBe(0)
    expect(w.find('.catalog-empty').exists()).toBe(true)
  })
})

describe('ErpCatalog — grille de cards', () => {
  it('rend 15 cards par défaut', async () => {
    const w = await mountSuspended(ErpCatalog)
    expect(w.findAll('.product-card').length).toBe(15)
  })

  it('chaque card affiche nom, catégorie, stock, prix et badge statut', async () => {
    const w = await mountSuspended(ErpCatalog)
    const first = w.findAll('.product-card')[0]!
    expect(first.find('.product-name').text()).toBe('Thon rouge entier')
    expect(first.find('.product-category').text()).toBe('Poissons frais')
    expect(first.find('.product-stock').text()).toContain('32,4')
    expect(first.find('.product-stock').text()).toContain('kg')
    expect(first.find('.product-price').text()).toBe('38,00 €/kg')
    expect(first.find('.badge').exists()).toBe(true)
  })

  it('applique la classe de badge selon le statut', async () => {
    const w = await mountSuspended(ErpCatalog)
    const cards = w.findAll('.product-card')
    const lotte = cards.find(c => c.text().includes('Lotte'))!
    expect(lotte.find('.badge').classes()).toContain('is-inactive')
    const langoustines = cards.find(c => c.text().includes('Langoustines'))!
    expect(langoustines.find('.badge').classes()).toContain('is-low')
    const thon = cards[0]!
    expect(thon.find('.badge').classes()).toContain('is-active')
  })
})
