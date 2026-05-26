import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'

const { signInMock, navigateMock, userRef } = vi.hoisted(() => {
  const { ref } = require('vue') as typeof import('vue')
  return {
    signInMock: vi.fn(),
    navigateMock: vi.fn(),
    userRef: ref<{ email: string } | null>(null),
  }
})

mockNuxtImport('useSupabaseClient', () => () => ({
  auth: { signInWithPassword: signInMock, signOut: vi.fn() },
}))
mockNuxtImport('useSupabaseUser', () => () => userRef)
mockNuxtImport('navigateTo', () => navigateMock)
mockNuxtImport('definePageMeta', () => () => {})

import Login from '~/pages/login.vue'

describe('Page /login', () => {
  beforeEach(() => {
    signInMock.mockReset()
    navigateMock.mockReset()
    userRef.value = null
  })

  it('affiche un champ email, un champ password et un bouton de connexion', async () => {
    const w = await mountSuspended(Login)
    expect(w.find('input[type="email"]').exists()).toBe(true)
    expect(w.find('input[type="password"]').exists()).toBe(true)
    expect(w.find('button[type="submit"]').exists()).toBe(true)
  })

  it('soumet les identifiants à Supabase', async () => {
    signInMock.mockResolvedValue({ data: { user: { email: 'm@p.fr' } }, error: null })
    const w = await mountSuspended(Login)

    await w.find('input[type="email"]').setValue('m@p.fr')
    await w.find('input[type="password"]').setValue('secret')
    await w.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(signInMock).toHaveBeenCalledWith({ email: 'm@p.fr', password: 'secret' })
  })

  it('redirige vers /dashboard après une connexion réussie', async () => {
    signInMock.mockResolvedValue({ data: { user: { email: 'm@p.fr' } }, error: null })
    const w = await mountSuspended(Login)

    await w.find('input[type="email"]').setValue('m@p.fr')
    await w.find('input[type="password"]').setValue('secret')
    await w.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(navigateMock).toHaveBeenCalledWith('/dashboard')
  })

  it('affiche un message d\'erreur quand Supabase refuse les identifiants', async () => {
    signInMock.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid login credentials' } })
    const w = await mountSuspended(Login)

    await w.find('input[type="email"]').setValue('m@p.fr')
    await w.find('input[type="password"]').setValue('wrong')
    await w.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(w.find('.login-error').exists()).toBe(true)
    expect(w.find('.login-error').text()).toContain('Identifiants invalides')
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
