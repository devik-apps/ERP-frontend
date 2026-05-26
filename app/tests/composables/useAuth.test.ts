import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'

const { signInMock, signOutMock, userRef } = vi.hoisted(() => {
  const { ref } = require('vue') as typeof import('vue')
  return {
    signInMock: vi.fn(),
    signOutMock: vi.fn(),
    userRef: ref<{ email: string } | null>(null),
  }
})

mockNuxtImport('useSupabaseClient', () => () => ({
  auth: {
    signInWithPassword: signInMock,
    signOut: signOutMock,
  },
}))

mockNuxtImport('useSupabaseUser', () => () => userRef)

const Probe = defineComponent({
  async setup() {
    const { useAuth } = await import('~/composables/useAuth')
    const auth = useAuth()
    return {
      isAuthenticated: auth.isAuthenticated,
      email: auth.email,
      signIn: auth.signIn,
      signOut: auth.signOut,
    }
  },
  template: `
    <div>
      <span class="auth">{{ isAuthenticated ? 'yes' : 'no' }}</span>
      <span class="email">{{ email ?? '' }}</span>
    </div>
  `,
})

describe('useAuth', () => {
  beforeEach(() => {
    signInMock.mockReset()
    signOutMock.mockReset()
    userRef.value = null
  })

  it('isAuthenticated est false quand aucun utilisateur', async () => {
    const w = await mountSuspended(Probe)
    expect(w.find('.auth').text()).toBe('no')
    expect(w.find('.email').text()).toBe('')
  })

  it('isAuthenticated est true et expose l\'email quand un utilisateur est présent', async () => {
    userRef.value = { email: 'marc@poisson.fr' }
    const w = await mountSuspended(Probe)
    expect(w.find('.auth').text()).toBe('yes')
    expect(w.find('.email').text()).toBe('marc@poisson.fr')
  })

  it('signIn appelle signInWithPassword avec email et password', async () => {
    signInMock.mockResolvedValue({ data: { user: { email: 'a@b.c' } }, error: null })
    const w = await mountSuspended(Probe)
    await (w.vm as any).signIn('a@b.c', 'secret')
    expect(signInMock).toHaveBeenCalledWith({ email: 'a@b.c', password: 'secret' })
  })

  it('signIn renvoie l\'erreur Supabase quand l\'identifiant est invalide', async () => {
    signInMock.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid login credentials' } })
    const w = await mountSuspended(Probe)
    const res = await (w.vm as any).signIn('bad@x.y', 'wrong')
    expect(res.error?.message).toBe('Invalid login credentials')
  })

  it('signOut appelle supabase.auth.signOut', async () => {
    signOutMock.mockResolvedValue({ error: null })
    const w = await mountSuspended(Probe)
    await (w.vm as any).signOut()
    expect(signOutMock).toHaveBeenCalledOnce()
  })
})
