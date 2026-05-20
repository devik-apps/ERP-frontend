import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import ErpStockMovement from '~/components/Erp/StockMovement.vue'

const PRODUCT = { id: 'prod-001', label: 'Thon rouge entier', currentStock: 32.4 }

function mount() {
  return mountSuspended(ErpStockMovement, { props: { product: PRODUCT } })
}

describe('ErpStockMovement — produit verrouillé', () => {
  it("n'expose pas de sélecteur de produit", async () => {
    const w = await mount()
    expect(w.find('select[name="product"]').exists()).toBe(false)
  })

  it('affiche le produit ciblé', async () => {
    const w = await mount()
    expect(w.text()).toContain('Thon rouge entier')
  })
})

describe('ErpStockMovement — segments de type', () => {
  it('expose deux segments Entrée et Sortie, Entrée actif par défaut', async () => {
    const w = await mount()
    const segs = w.findAll('[data-field="type"] .seg-btn')
    expect(segs).toHaveLength(2)
    expect(segs[0]!.text()).toBe('Entrée')
    expect(segs[1]!.text()).toBe('Sortie')
    expect(segs[0]!.classes()).toContain('is-on')
  })

  it('change le segment actif au clic sur Sortie', async () => {
    const w = await mount()
    const segs = w.findAll('[data-field="type"] .seg-btn')
    await segs[1]!.trigger('click')
    expect(segs[1]!.classes()).toContain('is-on')
    expect(segs[0]!.classes()).not.toContain('is-on')
  })
})

describe('ErpStockMovement — champs du formulaire', () => {
  it('expose quantité, poids unitaire, origine, opérateur, note', async () => {
    const w = await mount()
    expect(w.find('input[name="qty"]').attributes('type')).toBe('number')
    expect(w.find('input[name="unitWeight"]').attributes('type')).toBe('number')
    expect(w.find('input[name="origin"]').exists()).toBe(true)
    expect(w.find('select[name="operator"]').exists()).toBe(true)
    expect(w.find('textarea[name="note"]').exists()).toBe(true)
  })

  it('renomme origine en destination quand Sortie est sélectionné', async () => {
    const w = await mount()
    const segs = w.findAll('[data-field="type"] .seg-btn')
    await segs[1]!.trigger('click')
    expect(w.find('[data-field="origin"] .field-label').text()).toBe('Destination')
  })
})

describe('ErpStockMovement — récapitulatif live', () => {
  it('calcule le poids total = quantité × poids unitaire', async () => {
    const w = await mount()
    await w.find('input[name="qty"]').setValue(4)
    await w.find('input[name="unitWeight"]').setValue(800)
    expect(w.find('[data-summary="total-weight"]').text()).toContain('3 200')
  })

  it('calcule le stock après mouvement pour une Entrée', async () => {
    const w = await mount()
    await w.find('input[name="qty"]').setValue(4)
    await w.find('input[name="unitWeight"]').setValue(800)
    expect(w.find('[data-summary="stock-after"]').text()).toContain('35,6')
  })

  it('calcule le stock après mouvement pour une Sortie', async () => {
    const w = await mount()
    const segs = w.findAll('[data-field="type"] .seg-btn')
    await segs[1]!.trigger('click')
    await w.find('input[name="qty"]').setValue(2)
    await w.find('input[name="unitWeight"]').setValue(1000)
    expect(w.find('[data-summary="stock-after"]').text()).toContain('30,4')
  })

  it('signale un stock insuffisant quand une sortie dépasse le stock', async () => {
    const w = await mount()
    const segs = w.findAll('[data-field="type"] .seg-btn')
    await segs[1]!.trigger('click')
    await w.find('input[name="qty"]').setValue(100)
    await w.find('input[name="unitWeight"]').setValue(1000)
    expect(w.find('.movement-warning').text()).toContain('insuffisant')
  })
})

describe('ErpStockMovement — validation et soumission', () => {
  it('désactive le bouton tant que quantité ou poids est nul', async () => {
    const w = await mount()
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('active le bouton quand quantité et poids sont renseignés', async () => {
    const w = await mount()
    await w.find('input[name="qty"]').setValue(2)
    await w.find('input[name="unitWeight"]').setValue(500)
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })

  it('désactive le bouton si la sortie dépasse le stock', async () => {
    const w = await mount()
    const segs = w.findAll('[data-field="type"] .seg-btn')
    await segs[1]!.trigger('click')
    await w.find('input[name="qty"]').setValue(100)
    await w.find('input[name="unitWeight"]').setValue(1000)
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('soumet via PUT /stock/{uuid} et émet submitted', async () => {
    const w = await mount()
    await w.find('input[name="qty"]').setValue(4)
    await w.find('input[name="unitWeight"]').setValue(800)
    await w.find('form').trigger('submit')
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.emitted('submitted')).toBeTruthy()
  })

  it('émet cancel au clic sur Annuler', async () => {
    const w = await mount()
    await w.find('[data-action="cancel"]').trigger('click')
    expect(w.emitted('cancel')).toBeTruthy()
  })
})
