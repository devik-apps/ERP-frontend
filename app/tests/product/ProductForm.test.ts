import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import ErpProductForm from '~/components/Erp/ProductForm.vue'

async function mount(props: Record<string, unknown> = {}) {
  const w = await mountSuspended(ErpProductForm, { props })
  await flushPromises()
  await w.vm.$nextTick()
  return w
}

describe('ErpProductForm — création', () => {
  it('expose les champs label, description, catégorie et actif', async () => {
    const w = await mount()
    expect(w.find('input[name="label"]').exists()).toBe(true)
    expect(w.find('textarea[name="description"]').exists()).toBe(true)
    expect(w.find('select[name="category"]').exists()).toBe(true)
    expect(w.find('input[name="isActive"]').exists()).toBe(true)
  })

  it('peuple la liste des catégories depuis /categories', async () => {
    const w = await mount()
    const options = w.findAll('select[name="category"] option')
    expect(options.length).toBe(5)
  })

  it('désactive le bouton tant que le label est vide', async () => {
    const w = await mount()
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('active le bouton dès que le label est renseigné', async () => {
    const w = await mount()
    await w.find('input[name="label"]').setValue('Nouveau produit')
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })

  it('soumet via PUT /products/{uuid} et émet submitted avec un id', async () => {
    const w = await mount()
    await w.find('input[name="label"]').setValue('Nouveau produit')
    await w.find('form').trigger('submit')
    await flushPromises()
    await w.vm.$nextTick()
    const events = w.emitted('submitted')
    expect(events).toBeTruthy()
    expect((events![0] as [string])[0]).toMatch(/^[0-9a-f-]{36}$/)
  })
})

describe('ErpProductForm — édition', () => {
  const EXISTING = {
    id: 'prod-001',
    label: 'Thon rouge entier',
    description: 'Description existante',
    category: { id: 'cat-1', label: 'Poissons frais' },
    isActive: true,
  }

  it('pré-remplit les champs depuis la prop product', async () => {
    const w = await mount({ product: EXISTING })
    expect((w.find('input[name="label"]').element as HTMLInputElement).value).toBe('Thon rouge entier')
    expect((w.find('textarea[name="description"]').element as HTMLTextAreaElement).value).toBe('Description existante')
    expect((w.find('select[name="category"]').element as HTMLSelectElement).value).toBe('cat-1')
    expect((w.find('input[name="isActive"]').element as HTMLInputElement).checked).toBe(true)
  })

  it('soumet en conservant l\'id existant', async () => {
    const w = await mount({ product: EXISTING })
    await w.find('input[name="label"]').setValue('Thon édité')
    await w.find('form').trigger('submit')
    await flushPromises()
    await w.vm.$nextTick()
    const events = w.emitted('submitted')
    expect(events).toBeTruthy()
    expect((events![0] as [string])[0]).toBe('prod-001')
  })
})

describe('ErpProductForm — annulation', () => {
  it('émet cancel au clic sur Annuler', async () => {
    const w = await mount()
    await w.find('[data-action="cancel"]').trigger('click')
    expect(w.emitted('cancel')).toBeTruthy()
  })
})
