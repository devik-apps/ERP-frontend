<script setup lang="ts">
const props = defineProps<{ active: string }>()

const sectionLabels: Record<string, string> = {
  dashboard: 'Tableau de bord',
  catalog:   'Produits',
  product:   'Fiche produit',
  stock:     'Stock',
  sales:     'Ventes',
  transform: 'Transformations',
}

const currentLabel = computed(() => sectionLabels[props.active] ?? 'Tableau de bord')

const today = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date())
})
</script>

<template>
  <div class="topbar">
    <div class="crumbs">
      <span>Poissonnerie du Vieux Port</span>
      <span class="sep">/</span>
      <span class="cur">{{ currentLabel }}</span>
    </div>
    <div class="topbar-tools">
      <span class="small muted">{{ today }}</span>
      <span class="kbd">⌘ K</span>
    </div>
  </div>
</template>
