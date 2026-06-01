import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ErpTopbar from '~/components/Erp/Topbar.vue'

describe('ErpTopbar', () => {
  it('affiche le fil d\'ariane avec l\'enseigne', async () => {
    const w = await mountSuspended(ErpTopbar, { route: '/dashboard' })
    expect(w.find('.crumbs').text()).toContain('Fishoo')
  })

  it('affiche la section active dans le fil d\'ariane selon la route', async () => {
    const w = await mountSuspended(ErpTopbar, { route: '/products' })
    expect(w.find('.crumbs .cur').text()).toBe('Produits')
  })

  it('affiche le raccourci clavier ⌘ K', async () => {
    const w = await mountSuspended(ErpTopbar, { route: '/dashboard' })
    expect(w.find('.kbd').text()).toBe('⌘ K')
  })
})
