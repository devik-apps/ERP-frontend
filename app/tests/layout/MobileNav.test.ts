import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ErpSidebar from '~/components/Erp/Sidebar.vue'
import ErpTopbar from '~/components/Erp/Topbar.vue'
import { useMobileNav } from '~/composables/useMobileNav'

describe('Navigation mobile', () => {
  it('useMobileNav expose un état fermé par défaut', () => {
    const nav = useMobileNav()
    nav.close()
    expect(nav.open.value).toBe(false)
  })

  it('useMobileNav toggle bascule l\'état', () => {
    const nav = useMobileNav()
    nav.close()
    nav.toggle()
    expect(nav.open.value).toBe(true)
    nav.toggle()
    expect(nav.open.value).toBe(false)
  })

  it('Topbar affiche un bouton hamburger .sb-toggle', async () => {
    const w = await mountSuspended(ErpTopbar, { route: '/dashboard' })
    expect(w.find('.sb-toggle').exists()).toBe(true)
  })

  it('cliquer le bouton hamburger ouvre la sidebar (useMobileNav.open = true)', async () => {
    const nav = useMobileNav()
    nav.close()
    const w = await mountSuspended(ErpTopbar, { route: '/dashboard' })
    await w.find('.sb-toggle').trigger('click')
    expect(nav.open.value).toBe(true)
  })

  it('Sidebar reçoit la classe is-open quand la nav mobile est ouverte', async () => {
    const nav = useMobileNav()
    nav.close()
    const closed = await mountSuspended(ErpSidebar)
    expect(closed.find('.sb').classes()).not.toContain('is-open')

    nav.toggle()
    const opened = await mountSuspended(ErpSidebar)
    expect(opened.find('.sb').classes()).toContain('is-open')
    nav.close()
  })

  it('Sidebar rend un backdrop .sb-backdrop quand la nav mobile est ouverte', async () => {
    const nav = useMobileNav()
    nav.close()
    const closed = await mountSuspended(ErpSidebar)
    expect(closed.find('.sb-backdrop').exists()).toBe(false)

    nav.toggle()
    const opened = await mountSuspended(ErpSidebar)
    expect(opened.find('.sb-backdrop').exists()).toBe(true)
    nav.close()
  })

  it('cliquer le backdrop ferme la sidebar', async () => {
    const nav = useMobileNav()
    nav.close()
    nav.toggle()
    expect(nav.open.value).toBe(true)
    const w = await mountSuspended(ErpSidebar)
    await w.find('.sb-backdrop').trigger('click')
    expect(nav.open.value).toBe(false)
  })

  it('cliquer un lien de navigation ferme la sidebar', async () => {
    const nav = useMobileNav()
    nav.close()
    nav.toggle()
    expect(nav.open.value).toBe(true)
    const w = await mountSuspended(ErpSidebar)
    await w.find('a.sb-item').trigger('click')
    expect(nav.open.value).toBe(false)
  })
})
