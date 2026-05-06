import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ErpSidebar from '~/components/Erp/Sidebar.vue'

describe('ErpSidebar', () => {
  it('affiche le nom de l\'enseigne', async () => {
    const w = await mountSuspended(ErpSidebar)
    expect(w.find('.sb-brand-name').text()).toBe('Poissonnerie')
    expect(w.find('.sb-brand-sub').text()).toBe('du Vieux Port')
  })

  it('affiche tous les items de navigation actifs comme des liens', async () => {
    const w = await mountSuspended(ErpSidebar)
    const links = w.findAll('a.sb-item:not(.is-disabled)')
    expect(links.some(l => l.text().includes('Tableau de bord'))).toBe(true)
    expect(links.some(l => l.text().includes('Produits'))).toBe(true)
    expect(links.some(l => l.text().includes('Stock'))).toBe(true)
    expect(links.some(l => l.text().includes('Ventes'))).toBe(true)
  })

  it('marque l\'item actif avec is-active selon la route', async () => {
    const w = await mountSuspended(ErpSidebar, { route: '/products' })
    const active = w.find('.sb-item.is-active')
    expect(active.text()).toContain('Produits')
  })

  it('affiche Fournisseurs comme lien actif', async () => {
    const w = await mountSuspended(ErpSidebar)
    const links = w.findAll('a.sb-item')
    expect(links.some(l => l.text().includes('Fournisseurs'))).toBe(true)
  })

  it('affiche l\'utilisateur en pied de sidebar', async () => {
    const w = await mountSuspended(ErpSidebar)
    expect(w.find('.sb-user-name').exists()).toBe(true)
    expect(w.find('.sb-user-role').exists()).toBe(true)
  })
})
