import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
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
      'Lots en cours',
      'Pertes',
    ])
  })

  it('affiche les valeurs principales', async () => {
    const w = await mountSuspended(ErpTransform)
    const nums = w.findAll('.metric-num').map(el => el.text())
    expect(nums[0]).toBe('23')
    expect(nums[1]).toBe('74')
    expect(nums[2]).toBe('5')
    expect(nums[3]).toBe('18,4')
  })
})

describe('ErpTransform — filtres par statut', () => {
  it('expose 4 chips de filtre, Tous actif par défaut', async () => {
    const w = await mountSuspended(ErpTransform)
    const chips = w.findAll('.chip')
    expect(chips).toHaveLength(4)
    const labels = chips.map(c => c.text())
    expect(labels).toEqual(['Tous', 'En cours', 'Terminé', 'Contrôle'])
    expect(chips[0]!.classes()).toContain('is-active')
  })

  it('filtre les lots En cours au clic', async () => {
    const w = await mountSuspended(ErpTransform)
    const chips = w.findAll('.chip')
    await chips[1]!.trigger('click')
    expect(chips[1]!.classes()).toContain('is-active')
    expect(chips[0]!.classes()).not.toContain('is-active')
    expect(w.findAll('.tbl tbody tr').length).toBe(4)
  })

  it('filtre les lots Terminé au clic', async () => {
    const w = await mountSuspended(ErpTransform)
    const chips = w.findAll('.chip')
    await chips[2]!.trigger('click')
    expect(w.findAll('.tbl tbody tr').length).toBe(6)
  })

  it('filtre les lots Contrôle au clic', async () => {
    const w = await mountSuspended(ErpTransform)
    const chips = w.findAll('.chip')
    await chips[3]!.trigger('click')
    expect(w.findAll('.tbl tbody tr').length).toBe(2)
  })
})

describe('ErpTransform — journal des lots', () => {
  it('affiche le titre et le sous-titre du tableau', async () => {
    const w = await mountSuspended(ErpTransform)
    const head = w.find('.table-head')
    expect(head.text()).toContain('Lots récents')
    expect(head.text()).toContain('12 derniers lots')
  })

  it('rend les 12 lots par défaut (filtre Tous)', async () => {
    const w = await mountSuspended(ErpTransform)
    const rows = w.findAll('.tbl tbody tr')
    expect(rows.length).toBe(12)
  })

  it('contient les 8 colonnes attendues', async () => {
    const w = await mountSuspended(ErpTransform)
    const headers = w.findAll('.tbl thead th').map(th => th.text())
    expect(headers).toEqual([
      'Lot', 'Date', 'Matière', 'Produit fini', 'Entrée', 'Sortie', 'Rendement', 'Statut',
    ])
  })

  it('affiche un badge is-active pour les lots terminés', async () => {
    const w = await mountSuspended(ErpTransform)
    expect(w.find('.badge.is-active').exists()).toBe(true)
  })

  it('affiche un badge is-low pour les lots en cours', async () => {
    const w = await mountSuspended(ErpTransform)
    expect(w.find('.badge.is-low').exists()).toBe(true)
  })

  it('affiche un badge is-inactive pour les lots en contrôle', async () => {
    const w = await mountSuspended(ErpTransform)
    expect(w.find('.badge.is-inactive').exists()).toBe(true)
  })
})
