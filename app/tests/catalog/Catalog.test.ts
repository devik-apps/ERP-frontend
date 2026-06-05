import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { server } from '~/tests/mocks/server'
import ErpCatalog from '~/components/Erp/Catalog.vue'

async function mount() {
  const w = await mountSuspended(ErpCatalog)
  await flushPromises()
  await w.vm.$nextTick()
  return w
}

describe('ErpCatalog — entête', () => {
  it('affiche eyebrow, titre et sous-titre', async () => {
    const w = await mount()
    expect(w.find('.eyebrow').text()).toBe('Produits')
    expect(w.find('.sec-title').text()).toBe('Catalogue')
    expect(w.text()).toContain('15 références')
  })

  it('a l\'id catalog sur le header', async () => {
    const w = await mount()
    expect(w.find('#catalog').exists()).toBe(true)
  })
})

describe('ErpCatalog — recherche et filtres', () => {
  it('expose un champ de recherche', async () => {
    const w = await mount()
    const input = w.find('input[type="search"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBeTruthy()
  })

  it('filtre les produits par texte saisi', async () => {
    const w = await mount()
    const input = w.find('input[type="search"]')
    await input.setValue('saumon')
    const cards = w.findAll('.product-card')
    expect(cards.length).toBe(3)
  })

  it('expose les chips de catégorie (Toutes + 5 catégories)', async () => {
    const w = await mount()
    const chips = w.findAll('[data-filter="category"] .chip')
    expect(chips).toHaveLength(6)
    expect(chips[0]!.text()).toBe('Toutes')
    expect(chips[0]!.classes()).toContain('is-active')
  })

  it('filtre par catégorie au clic', async () => {
    const w = await mount()
    const chips = w.findAll('[data-filter="category"] .chip')
    const coquillages = chips.find(c => c.text() === 'Coquillages')!
    await coquillages.trigger('click')
    const cards = w.findAll('.product-card')
    expect(cards.length).toBe(3)
    expect(coquillages.classes()).toContain('is-active')
  })

  it('expose les chips de statut (Tous + 3 statuts)', async () => {
    const w = await mount()
    const chips = w.findAll('[data-filter="status"] .chip')
    expect(chips).toHaveLength(4)
    expect(chips[0]!.text()).toBe('Tous')
    expect(chips[0]!.classes()).toContain('is-active')
  })

  it('filtre par statut Stock bas', async () => {
    const w = await mount()
    const chips = w.findAll('[data-filter="status"] .chip')
    const low = chips.find(c => c.text() === 'Stock bas')!
    await low.trigger('click')
    const cards = w.findAll('.product-card')
    expect(cards.length).toBe(1)
  })

  it('combine recherche, catégorie et statut', async () => {
    const w = await mount()
    const input = w.find('input[type="search"]')
    await input.setValue('thon')
    const cat = w.findAll('[data-filter="category"] .chip').find(c => c.text() === 'Préparations')!
    await cat.trigger('click')
    const cards = w.findAll('.product-card')
    expect(cards.length).toBe(1)
    expect(cards[0]!.text()).toContain('Tartare de thon')
  })

  it('affiche un message vide si aucun produit ne matche', async () => {
    const w = await mount()
    await w.find('input[type="search"]').setValue('xyzxyz')
    expect(w.findAll('.product-card').length).toBe(0)
    expect(w.find('.catalog-empty').exists()).toBe(true)
  })
})

describe('ErpCatalog — grille de cards', () => {
  it('rend 15 cards par défaut', async () => {
    const w = await mount()
    expect(w.findAll('.product-card').length).toBe(15)
  })

  it('chaque card affiche nom, catégorie, stock et badge statut', async () => {
    const w = await mount()
    const first = w.findAll('.product-card')[0]!
    expect(first.find('.product-name').text()).toBe('Thon rouge entier')
    expect(first.find('.product-category').text()).toBe('Poissons frais')
    expect(first.find('.product-stock').text()).toContain('32,4')
    expect(first.find('.badge').exists()).toBe(true)
  })

  it('applique la classe de badge selon le statut', async () => {
    const w = await mount()
    const cards = w.findAll('.product-card')
    const lotte = cards.find(c => c.text().includes('Lotte'))!
    expect(lotte.find('.badge').classes()).toContain('is-inactive')
    const langoustines = cards.find(c => c.text().includes('Langoustines'))!
    expect(langoustines.find('.badge').classes()).toContain('is-low')
    const thon = cards[0]!
    expect(thon.find('.badge').classes()).toContain('is-active')
  })

  it('chaque card est un lien vers la fiche produit', async () => {
    const w = await mount()
    const first = w.findAll('.product-card')[0]!
    expect(first.attributes('href')).toContain('/products/prod-001')
  })
})

describe('ErpCatalog — création produit', () => {
  it('expose un bouton "Nouveau produit"', async () => {
    const w = await mount()
    const btn = w.find('[data-action="new-product"]')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toContain('Nouveau produit')
  })

  it('la modale est fermée au démarrage', async () => {
    const w = await mount()
    expect(w.find('.modal-backdrop').exists()).toBe(false)
  })

  it('ouvre la modale au clic sur Nouveau produit', async () => {
    const w = await mount()
    await w.find('[data-action="new-product"]').trigger('click')
    await flushPromises()
    expect(w.find('.modal-backdrop').exists()).toBe(true)
    expect(w.find('.modal-title').text()).toBe('Nouveau produit')
    expect(w.find('input[name="label"]').exists()).toBe(true)
  })
})
