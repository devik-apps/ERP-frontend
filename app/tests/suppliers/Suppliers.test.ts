import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ErpSuppliers from '~/components/Erp/Suppliers.vue'

describe('ErpSuppliers', () => {
  it('affiche le titre de la section', async () => {
    const w = await mountSuspended(ErpSuppliers)
    expect(w.find('.eyebrow').text()).toBe('Fournisseurs')
    expect(w.find('.sec-title').text()).toBe('Annuaire')
  })

  it('rend 4 cartes de métriques', async () => {
    const w = await mountSuspended(ErpSuppliers)
    expect(w.findAll('.metric')).toHaveLength(4)
  })

  it('affiche 10 fournisseurs par défaut', async () => {
    const w = await mountSuspended(ErpSuppliers)
    expect(w.findAll('tbody tr')).toHaveLength(10)
  })

  it('le filtre Actif réduit à 8 lignes', async () => {
    const w = await mountSuspended(ErpSuppliers)
    await w.find('[data-filter="status"] .chip:nth-child(2)').trigger('click')
    expect(w.findAll('tbody tr')).toHaveLength(8)
  })

  it('le filtre Inactif réduit à 1 ligne', async () => {
    const w = await mountSuspended(ErpSuppliers)
    const chips = w.findAll('[data-filter="status"] .chip')
    const inactif = chips.find(c => c.text() === 'Inactif')
    await inactif!.trigger('click')
    expect(w.findAll('tbody tr')).toHaveLength(1)
  })

  it('le filtre Coquillages réduit à 3 lignes', async () => {
    const w = await mountSuspended(ErpSuppliers)
    const chips = w.findAll('[data-filter="category"] .chip')
    const coquillages = chips.find(c => c.text() === 'Coquillages')
    await coquillages!.trigger('click')
    expect(w.findAll('tbody tr')).toHaveLength(3)
  })
})
