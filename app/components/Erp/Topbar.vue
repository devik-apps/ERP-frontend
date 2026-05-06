<script setup lang="ts">
const route = useRoute()

const routeLabels: Record<string, string> = {
  '/dashboard':      'Tableau de bord',
  '/products':       'Produits',
  '/stock':          'Stock',
  '/sales':          'Ventes',
  '/transformations': 'Transformations',
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
