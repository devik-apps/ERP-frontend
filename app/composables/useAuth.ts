import { computed } from 'vue'

export function useAuth() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const email = computed(() => (user.value as { email?: string } | null)?.email ?? null)
  const isAuthenticated = computed(() => user.value != null)

  async function signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signOut() {
    return supabase.auth.signOut()
  }

  return { user, email, isAuthenticated, signIn, signOut }
}
