import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { server } from '~/tests/mocks/server'
import ErpProductDetail from '~/components/Erp/ProductDetail.vue'

async function mount() {
  const w = await mountSuspended(ErpProductDetail, { props: { id: 'prod-001' } })
  await flushPromises()
  await w.vm.$nextTick()
  return w
}

describe('ErpProductDetail — entête', () => {
  it('affiche eyebrow, titre du produit et sous-titre', async () => {
    const w = await mount()
    expect(w.find('.eyebrow').text()).toBe('Fiche produit')
    expect(w.find('.sec-title').text()).toBe('Thon rouge entier')
    expect(w.find('.sec-sub').text()).toContain('prod-001')
  })

  it('a l\'id product sur le header', async () => {
    const w = await mount()
    expect(w.find('#product').exists()).toBe(true)
  })

  it('expose deux actions principales (mouvement, éditer)', async () => {
    const w = await mount()
    const actions = w.findAll('.sec-right .btn')
    expect(actions.length).toBe(2)
    expect(actions[0]!.text()).toContain('Mouvement')
    expect(actions[1]!.text()).toContain('Éditer')
  })
})

describe('ErpProductDetail — bloc résumé', () => {
  it('affiche les champs catégorie, statut, id et description', async () => {
    const w = await mount()
    const summary = w.find('.product-summary')
    expect(summary.exists()).toBe(true)
    expect(summary.text()).toContain('Poissons frais')
    expect(summary.text()).toContain('prod-001')
  })

  it('affiche le badge de statut avec la classe is-active', async () => {
    const w = await mount()
    const badge = w.find('.product-summary .badge')
    expect(badge.exists()).toBe(true)
    expect(badge.classes()).toContain('is-active')
    expect(badge.text()).toContain('Actif')
  })

  it('affiche la description du produit', async () => {
    const w = await mount()
    expect(w.find('.product-description').exists()).toBe(true)
    expect(w.find('.product-description').text().length).toBeGreaterThan(20)
  })
})

describe('ErpProductDetail — bloc stock', () => {
  it('affiche le total et le poids', async () => {
    const w = await mount()
    const stock = w.find('.product-stock-card')
    expect(stock.exists()).toBe(true)
    const items = stock.findAll('.stock-item')
    expect(items.length).toBe(2)
  })

  it('affiche les valeurs formatées en français', async () => {
    const w = await mount()
    const stock = w.find('.product-stock-card')
    expect(stock.text()).toContain('32,4')
  })

  it('affiche les libellés des items stock', async () => {
    const w = await mount()
    const stock = w.find('.product-stock-card')
    const labels = stock.findAll('.stock-item-label').map(n => n.text())
    expect(labels).toEqual(['Stock total', 'Poids'])
  })

  it('affiche une barre de progression du stock', async () => {
    const w = await mount()
    expect(w.find('.stock-bar').exists()).toBe(true)
    expect(w.find('.stock-bar-fill').exists()).toBe(true)
  })
})

describe('ErpProductDetail — tableau des prix', () => {
  it('affiche un tableau avec entête', async () => {
    const w = await mount()
    const table = w.find('.product-prices')
    expect(table.exists()).toBe(true)
    expect(table.find('table.tbl').exists()).toBe(true)
  })

  it('expose les colonnes Conditionnement et Prix', async () => {
    const w = await mount()
    const headers = w.findAll('.product-prices thead th').map(t => t.text())
    expect(headers).toEqual(['Conditionnement', 'Prix'])
  })

  it('rend 4 lignes de prix', async () => {
    const w = await mount()
    const rows = w.findAll('.product-prices tbody tr')
    expect(rows.length).toBe(4)
  })

  it('chaque ligne affiche conditionnement et prix formaté', async () => {
    const w = await mount()
    const first = w.findAll('.product-prices tbody tr')[0]!
    const cells = first.findAll('td')
    expect(cells[0]!.text()).toBe('Détail')
    expect(cells[1]!.text()).toContain('€/kg')
  })
})

describe('ErpProductDetail — modales mouvement et édition', () => {
  it('ouvre la modale de mouvement au clic sur Mouvement', async () => {
    const w = await mount()
    expect(w.find('.modal-backdrop').exists()).toBe(false)
    await w.find('[data-action="new-movement"]').trigger('click')
    await flushPromises()
    expect(w.find('.modal-backdrop').exists()).toBe(true)
    expect(w.find('.modal-title').text()).toContain('Mouvement')
    expect(w.find('input[name="qty"]').exists()).toBe(true)
    expect(w.find('select[name="product"]').exists()).toBe(false)
  })

  it('ouvre la modale d\'édition au clic sur Éditer, préremplie', async () => {
    const w = await mount()
    await w.find('[data-action="edit-product"]').trigger('click')
    await flushPromises()
    expect(w.find('.modal-backdrop').exists()).toBe(true)
    expect(w.find('.modal-title').text()).toBe('Éditer le produit')
    const input = w.find('input[name="label"]').element as HTMLInputElement
    expect(input.value).toBe('Thon rouge entier')
  })
})

describe('ErpProductDetail — état API hors-ligne', () => {
  it('affiche un bandeau "API indisponible" quand /products/:id échoue', async () => {
    server.use(
      http.get('https://api.erp.local/v1/products/:id', () => HttpResponse.error()),
    )
    const w = await mount()
    await flushPromises()
    expect(w.find('.api-state.is-error').exists()).toBe(true)
  })

  it('affiche une ligne "Aucun tarif" quand /products/:id/prices renvoie un tableau vide', async () => {
    server.use(
      http.get('https://api.erp.local/v1/products/:id/prices', () =>
        HttpResponse.json({ data: [] }),
      ),
    )
    const w = await mount()
    await flushPromises()
    expect(w.find('.tbl tbody tr.is-empty').text()).toContain('Aucun tarif')
  })
})
