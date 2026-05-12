<script setup lang="ts">
import {
  LayoutDashboard, Grid2x2, Layers,
  TrendingUp, Truck, Users,
} from 'lucide-vue-next'

const route = useRoute()
const nav = useMobileNav()

const navItems = [
  { id: 'dashboard',  label: 'Tableau de bord', icon: LayoutDashboard, to: '/dashboard' },
  { id: 'catalog',    label: 'Produits',         icon: Grid2x2,         to: '/products' },
  { id: 'stock',      label: 'Stock',             icon: Layers,          to: '/stock' },
  { id: 'sales',      label: 'Ventes',           icon: TrendingUp,      to: '/sales' },
  { id: 'transform',  label: 'Transformations',  icon: Truck,           to: '/transformations' },
  { id: 'suppliers',  label: 'Fournisseurs',     icon: Users,           to: '/suppliers' },
]

function isActive(item: typeof navItems[number]) {
  if (item.to === '/products') return route.path === '/products' || route.path.startsWith('/products/')
  return route.path === item.to
}
</script>

<template>
  <button
    v-if="nav.open.value"
    type="button"
    class="sb-backdrop"
    aria-label="Fermer le menu"
    @click="nav.close()"
  />
  <aside class="sb" :class="{ 'is-open': nav.open.value }">
    <div class="sb-brand">
      <span class="sb-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M3 12c3-5 8-6 12-6 3 0 6 2 6 6s-3 6-6 6c-4 0-9-1-12-6Z" />
          <circle cx="16" cy="11" r="0.6" fill="currentColor" stroke="none" />
          <path d="M3 12c1.5-1 3-1 4 0M3 12c1.5 1 3 1 4 0" />
        </svg>
      </span>
      <div>
        <div class="sb-brand-name">Poissonnerie</div>
        <div class="sb-brand-sub">du Vieux Port</div>
      </div>
    </div>

    <nav class="sb-nav">
      <NuxtLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.to"
        class="sb-item"
        :class="{ 'is-active': isActive(item) }"
        @click="nav.close()"
      >
        <component :is="item.icon" :size="16" :stroke-width="1" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <div class="sb-foot">
      <div class="sb-user">
        <div class="sb-avatar">M</div>
        <div>
          <div class="sb-user-name">Marc Loiseau</div>
          <div class="sb-user-role">Responsable</div>
        </div>
      </div>
    </div>
  </aside>
</template>
