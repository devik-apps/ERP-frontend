<script setup lang="ts">
import {
  LayoutDashboard, Grid2x2, Package, Layers,
  TrendingUp, Truck, Users,
} from 'lucide-vue-next'

const props = defineProps<{ active: string }>()
const emit = defineEmits<{ navigate: [id: string] }>()

const navItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'catalog',   label: 'Produits',         icon: Grid2x2 },
  { id: 'product',   label: 'Fiche produit',    icon: Package },
  { id: 'stock',     label: 'Stock',             icon: Layers },
  { id: 'sales',     label: 'Ventes',           icon: TrendingUp },
  { id: 'transform',     label: 'Transformations', icon: Truck,       disabled: true },
  { id: 'suppliers',     label: 'Fournisseurs',    icon: Users,       disabled: true },
]

function onNav(id: string) {
  emit('navigate', id)
}
</script>

<template>
  <aside class="sb">
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
      <button
        v-for="item in navItems"
        :key="item.id"
        class="sb-item"
        :class="{
          'is-active':   active === item.id,
          'is-disabled': item.disabled,
        }"
        :disabled="item.disabled"
        @click="!item.disabled && onNav(item.id)"
      >
        <component :is="item.icon" :size="16" :stroke-width="1" />
        <span>{{ item.label }}</span>
        <span v-if="item.disabled" class="sb-soon">bientôt</span>
      </button>
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
