import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import ErpSaleForm from '~/components/Erp/SaleForm.vue'

describe('ErpSaleForm', () => {
  it('rend au moins une ligne de ticket par défaut', async () => {
    const w = await mountSuspended(ErpSaleForm)
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.findAll('[data-line]').length).toBe(1)
  })

  it('« Ajouter une ligne » incrémente le nombre de lignes', async () => {
    const w = await mountSuspended(ErpSaleForm)
    await flushPromises()
    await w.vm.$nextTick()
    await w.find('[data-action="add-line"]').trigger('click')
    await w.vm.$nextTick()
    expect(w.findAll('[data-line]').length).toBe(2)
  })

  it('désactive Enregistrer tant qu\'aucune ligne n\'est complète', async () => {
    const w = await mountSuspended(ErpSaleForm)
    await flushPromises()
    await w.vm.$nextTick()
    const submit = w.find('button[type="submit"]')
    expect((submit.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('émet cancel au clic sur Annuler', async () => {
    const w = await mountSuspended(ErpSaleForm)
    await flushPromises()
    await w.find('[data-action="cancel"]').trigger('click')
    expect(w.emitted('cancel')).toBeTruthy()
  })
})
