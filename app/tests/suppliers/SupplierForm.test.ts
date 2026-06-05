import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import ErpSupplierForm from '~/components/Erp/SupplierForm.vue'

describe('ErpSupplierForm', () => {
  it('rend les champs nom, contact, description et statut', async () => {
    const w = await mountSuspended(ErpSupplierForm)
    expect(w.find('[data-field="name"]').exists()).toBe(true)
    expect(w.find('[data-field="contact"]').exists()).toBe(true)
    expect(w.find('[data-field="description"]').exists()).toBe(true)
    expect(w.find('[data-field="isActive"]').exists()).toBe(true)
  })

  it('désactive Enregistrer tant que le nom est vide', async () => {
    const w = await mountSuspended(ErpSupplierForm)
    const submit = w.find('button[type="submit"]')
    expect((submit.element as HTMLButtonElement).disabled).toBe(true)
    await w.find('input[name="name"]').setValue('Mareyeur Sète')
    expect((submit.element as HTMLButtonElement).disabled).toBe(false)
  })

  it('émet submitted après un enregistrement réussi', async () => {
    const w = await mountSuspended(ErpSupplierForm)
    await w.find('input[name="name"]').setValue('Mareyeur Sète')
    await w.find('form').trigger('submit')
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.emitted('submitted')).toBeTruthy()
  })

  it('émet cancel au clic sur Annuler', async () => {
    const w = await mountSuspended(ErpSupplierForm)
    await w.find('[data-action="cancel"]').trigger('click')
    expect(w.emitted('cancel')).toBeTruthy()
  })
})
