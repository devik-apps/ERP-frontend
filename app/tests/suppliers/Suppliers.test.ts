import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { server } from '~/tests/mocks/server'
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

  it('affiche les fournisseurs renvoyés par /suppliers', async () => {
    const w = await mountSuspended(ErpSuppliers)
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.findAll('tbody tr')).toHaveLength(10)
  })

  it('le filtre Actif réduit à 8 lignes', async () => {
    const w = await mountSuspended(ErpSuppliers)
    await flushPromises()
    await w.vm.$nextTick()
    await w.find('[data-filter="status"] .chip:nth-child(2)').trigger('click')
    expect(w.findAll('tbody tr')).toHaveLength(8)
  })

  it('le filtre Inactif réduit à 2 lignes', async () => {
    const w = await mountSuspended(ErpSuppliers)
    await flushPromises()
    await w.vm.$nextTick()
    const chips = w.findAll('[data-filter="status"] .chip')
    const inactif = chips.find(c => c.text() === 'Inactif')
    await inactif!.trigger('click')
    expect(w.findAll('tbody tr')).toHaveLength(2)
  })

  it('expose les KPIs agrégés depuis /suppliers', async () => {
    const w = await mountSuspended(ErpSuppliers)
    await flushPromises()
    await w.vm.$nextTick()
    const labels = w.findAll('.metric-label').map(el => el.text())
    expect(labels[0]).toBe('Total')
    expect(labels[1]).toBe('Actifs')
    expect(labels[2]).toBe('Inactifs')
    const nums = w.findAll('.metric-num').map(el => el.text())
    expect(nums[0]).toBe('10')
    expect(nums[1]).toBe('8')
    expect(nums[2]).toBe('2')
  })

  it('affiche une ligne "Aucun fournisseur" quand /suppliers renvoie un tableau vide', async () => {
    server.use(
      http.get('https://api.erp.local/v1/suppliers', () =>
        HttpResponse.json({ data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 0 } }),
      ),
    )
    const w = await mountSuspended(ErpSuppliers)
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.tbl tbody tr.is-empty').text()).toContain('Aucun fournisseur')
  })

  it('affiche un bandeau "API indisponible" quand /suppliers échoue', async () => {
    server.use(
      http.get('https://api.erp.local/v1/suppliers', () => HttpResponse.error()),
    )
    const w = await mountSuspended(ErpSuppliers)
    await flushPromises()
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.api-state.is-error').exists()).toBe(true)
  })
})
