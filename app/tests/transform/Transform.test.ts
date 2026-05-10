import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { server } from '~/tests/mocks/server'
import ErpTransform from '~/components/Erp/Transform.vue'

describe('ErpTransform — entête', () => {
  it('affiche eyebrow, titre et sous-titre', async () => {
    const w = await mountSuspended(ErpTransform)
    expect(w.find('.eyebrow').text()).toBe('Transformations')
    expect(w.find('.sec-title').text()).toBe('Atelier et lots')
    expect(w.find('.sec-sub').exists()).toBe(true)
  })

  it('a l\'id transform pour le scroll-spy', async () => {
    const w = await mountSuspended(ErpTransform)
    expect(w.find('#transform').exists()).toBe(true)
  })

  it('expose une action principale Nouveau lot', async () => {
    const w = await mountSuspended(ErpTransform)
    expect(w.text()).toContain('Nouveau lot')
  })
})

describe('ErpTransform — métriques', () => {
  it('rend exactement 4 cartes de métriques', async () => {
    const w = await mountSuspended(ErpTransform)
    expect(w.findAll('.metric').length).toBe(4)
  })

  it('affiche les 4 labels attendus', async () => {
    const w = await mountSuspended(ErpTransform)
    const labels = w.findAll('.metric-label').map(el => el.text())
    expect(labels).toEqual([
      'Lots du mois',
      'Rendement moyen',
      'Lots actifs',
      'Pertes',
    ])
  })

  it('affiche les valeurs agrégées depuis /transformations', async () => {
    const w = await mountSuspended(ErpTransform)
    await flushPromises()
    await w.vm.$nextTick()
    const nums = w.findAll('.metric-num').map(el => el.text())
    expect(nums[0]).toBe('7')
    expect(nums[1]).toBe('68')
    expect(nums[2]).toBe('2')
    expect(nums[3]).toBe('6,6')
  })

  it('les KPIs valent 0 quand /transformations renvoie un tableau vide', async () => {
    server.use(
      http.get('https://api.erp.local/v1/transformations', () =>
        HttpResponse.json({ data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 0 } }),
      ),
    )
    const w = await mountSuspended(ErpTransform)
    await flushPromises()
    await w.vm.$nextTick()
    const nums = w.findAll('.metric-num').map(el => el.text())
    expect(nums[0]).toBe('0')
    expect(nums[1]).toBe('0')
    expect(nums[2]).toBe('0')
    expect(nums[3]).toBe('0,0')
  })
})

describe('ErpTransform — journal des lots', () => {
  it('affiche le titre du tableau', async () => {
    const w = await mountSuspended(ErpTransform)
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.table-head').text()).toContain('Lots récents')
  })

  it('rend les lignes correspondant au mock', async () => {
    const w = await mountSuspended(ErpTransform)
    await flushPromises()
    await w.vm.$nextTick()
    const rows = w.findAll('.tbl tbody tr')
    expect(rows.length).toBe(2)
  })

  it('contient les 7 colonnes attendues', async () => {
    const w = await mountSuspended(ErpTransform)
    const headers = w.findAll('.tbl thead th').map(th => th.text())
    expect(headers).toEqual([
      'Lot', 'Date', 'Entrée', 'Sortie', 'Pertes', 'Rendement', 'Actif',
    ])
  })

  it('affiche une ligne "Aucun lot" quand /transformations renvoie un tableau vide', async () => {
    server.use(
      http.get('https://api.erp.local/v1/transformations', () =>
        HttpResponse.json({ data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 0 } }),
      ),
    )
    const w = await mountSuspended(ErpTransform)
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.tbl tbody tr.is-empty').text()).toContain('Aucun lot')
  })

  it('affiche un bandeau "API indisponible" quand /transformations échoue', async () => {
    server.use(
      http.get('https://api.erp.local/v1/transformations', () => HttpResponse.error()),
    )
    const w = await mountSuspended(ErpTransform)
    await flushPromises()
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.api-state.is-error').exists()).toBe(true)
  })
})
