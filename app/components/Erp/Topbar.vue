<script setup lang="ts">
import { LogOut, Menu } from 'lucide-vue-next'

const route = useRoute()
const nav = useMobileNav()
const { email, isAuthenticated, signOut } = useAuth()

const routeLabels: Record<string, string> = {
  '/dashboard':      'Tableau de bord',
  '/products':       'Produits',
  '/stock':          'Stock',
  '/sales':          'Ventes',
  '/suppliers':      'Fournisseurs',
}

const currentLabel = computed(() => {
  if (route.path.startsWith('/products/')) return 'Fiche produit'
  return routeLabels[route.path] ?? 'Tableau de bord'
})

const today = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date())
})

async function onLogout() {
  await signOut()
  await navigateTo('/login')
}
</script>

<template>
  <div class="topbar">
    <div class="crumbs">
      <button
        type="button"
        class="sb-toggle"
        aria-label="Ouvrir le menu"
        @click="nav.toggle()"
      >
        <Menu :size="16" :stroke-width="1.5" />
      </button>
      <span>Poissonnerie du Vieux Port</span>
      <span class="sep">/</span>
      <span class="cur">{{ currentLabel }}</span>
    </div>
    <div class="topbar-tools">
      <span class="small muted">{{ today }}</span>
      <span class="kbd">⌘ K</span>
      <template v-if="isAuthenticated">
        <span class="topbar-user">{{ email }}</span>
        <button
          type="button"
          class="topbar-logout"
          aria-label="Se déconnecter"
          title="Se déconnecter"
          @click="onLogout"
        >
          <LogOut :size="14" :stroke-width="1.5" />
        </button>
      </template>
    </div>
  </div>
</template>
