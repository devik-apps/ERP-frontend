import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import ErpProductPriceForm from '~/components/Erp/ProductPriceForm.vue'

async function mount(props: Record<string, unknown> = {}) {
  const w = await mountSuspended(ErpProductPriceForm, {
    props: { productId: 'prod-001', ...props },
  })
  await flushPromises()
  await w.vm.$nextTick()
  return w
}

describe('ErpProductPriceForm — création', () => {
  it('expose les champs conditionnement, montant et poids', async () => {
    const w = await mount()
    expect(w.find('select[name="packaging"]').exists()).toBe(true)
    expect(w.find('input[name="amount"]').exists()).toBe(true)
    expect(w.find('input[name="weightGrams"]').exists()).toBe(true)
  })

  it('peuple le sélecteur de conditionnement depuis /packaging', async () => {
    const w = await mount()
    const options = w.findAll('select[name="packaging"] option')
    expect(options.length).toBeGreaterThanOrEqual(4)
  })

  it('désactive le bouton tant que le montant vaut 0', async () => {
    const w = await mount()
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    await w.find('input[name="amount"]').setValue(38)
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })

  it('désactive le bouton si le poids vaut 0', async () => {
    const w = await mount()
    await w.find('input[name="amount"]').setValue(38)
    await w.find('input[name="weightGrams"]').setValue(0)
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('soumet via PUT /prices/{uuid} et émet submitted', async () => {
    const w = await mount()
    await w.find('input[name="amount"]').setValue(38)
    await w.find('input[name="weightGrams"]').setValue(1000)
    await w.find('form').trigger('submit')
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.emitted('submitted')).toBeTruthy()
  })
})

describe('ErpProductPriceForm — édition', () => {
  const EXISTING = {
    id: 'price-1',
    productId: 'prod-001',
    packaging: { id: 'pkg-2', label: 'Pro' },
    amount: 3400,
    weightGrams: 1000,
  }

  it('pré-remplit les champs depuis la prop price', async () => {
    const w = await mount({ price: EXISTING })
    expect((w.find('input[name="amount"]').element as HTMLInputElement).value).toBe('3400')
    expect((w.find('input[name="weightGrams"]').element as HTMLInputElement).value).toBe('1000')
    expect((w.find('select[name="packaging"]').element as HTMLSelectElement).value).toBe('pkg-2')
  })
})

describe('ErpProductPriceForm — création inline de conditionnement', () => {
  it('expose un bouton « + Nouveau » à côté du select', async () => {
    const w = await mount()
    expect(w.find('[data-action="new-packaging"]').exists()).toBe(true)
  })

  it('révèle un champ de saisie au clic sur « + Nouveau »', async () => {
    const w = await mount()
    expect(w.find('input[name="new-packaging-label"]').exists()).toBe(false)
    await w.find('[data-action="new-packaging"]').trigger('click')
    expect(w.find('input[name="new-packaging-label"]').exists()).toBe(true)
  })

  it('annule la création et revient au sélecteur', async () => {
    const w = await mount()
    await w.find('[data-action="new-packaging"]').trigger('click')
    await w.find('[data-action="cancel-packaging"]').trigger('click')
    expect(w.find('input[name="new-packaging-label"]').exists()).toBe(false)
    expect(w.find('select[name="packaging"]').exists()).toBe(true)
  })

  it('crée le conditionnement puis revient au sélecteur', async () => {
    const w = await mount()
    await w.find('[data-action="new-packaging"]').trigger('click')
    await w.find('input[name="new-packaging-label"]').setValue('Export')
    await w.find('[data-action="save-packaging"]').trigger('click')
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('input[name="new-packaging-label"]').exists()).toBe(false)
    expect(w.find('select[name="packaging"]').exists()).toBe(true)
  })
})

describe('ErpProductPriceForm — annulation', () => {
  it('émet cancel au clic sur Annuler', async () => {
    const w = await mount()
    await w.find('[data-action="cancel"]').trigger('click')
    expect(w.emitted('cancel')).toBeTruthy()
  })
})
