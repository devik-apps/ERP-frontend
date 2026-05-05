import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ErpSidebar from '~/components/Erp/Sidebar.vue'

describe('ErpSidebar', () => {
  it('affiche le nom de l\'enseigne', async () => {
    const w = await mountSuspended(ErpSidebar, {
      props: { active: 'dashboard' },
    })
    expect(w.find('.sb-brand-name').text()).toBe('Poissonnerie')
    expect(w.find('.sb-brand-sub').text()).toBe('du Vieux Port')
  })

  it('affiche tous les items de navigation actifs', async () => {
    const w = await mountSuspended(ErpSidebar, {
      props: { active: 'dashboard' },
    })
    const labels = w.findAll('.sb-item:not(.is-disabled)').map(b => b.text())
    expect(labels.some(l => l.includes('Tableau de bord'))).toBe(true)
    expect(labels.some(l => l.includes('Produits'))).toBe(true)
    expect(labels.some(l => l.includes('Fiche produit'))).toBe(true)
    expect(labels.some(l => l.includes('Stock'))).toBe(true)
  })

  it('marque l\'item actif avec is-active', async () => {
    const w = await mountSuspended(ErpSidebar, {
      props: { active: 'catalog' },
    })
    const active = w.find('.sb-item.is-active')
    expect(active.text()).toContain('Produits')
  })

  it('affiche les items désactivés avec is-disabled', async () => {
    const w = await mountSuspended(ErpSidebar, {
      props: { active: 'dashboard' },
    })
    const disabled = w.findAll('.sb-item.is-disabled')
    expect(disabled.length).toBeGreaterThanOrEqual(3)
  })

  it('affiche l\'utilisateur en pied de sidebar', async () => {
    const w = await mountSuspended(ErpSidebar, {
      props: { active: 'dashboard' },
    })
    expect(w.find('.sb-user-name').exists()).toBe(true)
    expect(w.find('.sb-user-role').exists()).toBe(true)
  })

  it('émet navigate au clic sur un item actif', async () => {
    const w = await mountSuspended(ErpSidebar, {
      props: { active: 'dashboard' },
    })
    const items = w.findAll('.sb-item:not(.is-disabled)')
    await items[0].trigger('click')
    expect(w.emitted('navigate')).toBeTruthy()
  })
})
