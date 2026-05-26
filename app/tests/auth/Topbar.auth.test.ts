import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'

const { signOutMock, navigateMock, userRef } = vi.hoisted(() => {
  const { ref } = require('vue') as typeof import('vue')
  return {
    signOutMock: vi.fn(),
    navigateMock: vi.fn(),
    userRef: ref<{ email: string } | null>({ email: 'marc@poisson.fr' }),
  }
})

mockNuxtImport('useSupabaseClient', () => () => ({
  auth: { signInWithPassword: vi.fn(), signOut: signOutMock },
}))
mockNuxtImport('useSupabaseUser', () => () => userRef)
mockNuxtImport('navigateTo', () => navigateMock)

import ErpTopbar from '~/components/Erp/Topbar.vue'

describe('ErpTopbar — authentification', () => {
  beforeEach(() => {
    signOutMock.mockReset()
    navigateMock.mockReset()
    userRef.value = { email: 'marc@poisson.fr' }
  })

  it('affiche l\'email de l\'utilisateur connecté', async () => {
    const w = await mountSuspended(ErpTopbar, { route: '/dashboard' })
    expect(w.find('.topbar-user').text()).toContain('marc@poisson.fr')
  })

  it('affiche un bouton de déconnexion', async () => {
    const w = await mountSuspended(ErpTopbar, { route: '/dashboard' })
    expect(w.find('button.topbar-logout').exists()).toBe(true)
  })

  it('déconnecte et redirige vers /login au clic sur le bouton', async () => {
    signOutMock.mockResolvedValue({ error: null })
    const w = await mountSuspended(ErpTopbar, { route: '/dashboard' })
    await w.find('button.topbar-logout').trigger('click')
    await flushPromises()
    expect(signOutMock).toHaveBeenCalledOnce()
    expect(navigateMock).toHaveBeenCalledWith('/login')
  })
})
