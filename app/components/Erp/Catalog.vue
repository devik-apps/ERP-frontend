<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { useCategories, useProducts, productStatus, type ProductStatus } from '~/composables/useProducts'

type StatusFilter = 'Tous' | ProductStatus

const { data: categoriesData } = useCategories()
const { data: productsData } = useProducts()

const search = ref('')
const activeCategory = ref('Toutes')
const activeStatus = ref<StatusFilter>('Tous')

const categoryChips = computed(() => ['Toutes', ...(categoriesData.value?.data?.map(c => c.label ?? '') ?? [])])
const statusChips: StatusFilter[] = ['Tous', 'Actif', 'Stock bas', 'Inactif']

const totalCount = computed(() => productsData.value?.meta?.total ?? 0)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return (productsData.value?.data ?? []).filter(p => {
    if (q && !p.label?.toLowerCase().includes(q)) return false
    if (activeCategory.value !== 'Toutes' && p.category?.label !== activeCategory.value) return false
    if (activeStatus.value !== 'Tous' && productStatus(p) !== activeStatus.value) return false
    return true
  })
})

function badgeClass(p: { isActive?: boolean; currentStock?: number }) {
  const s = productStatus(p)
  if (s === 'Stock bas') return 'is-low'
  if (s === 'Inactif')   return 'is-inactive'
  return 'is-active'
}

function stockFr(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}
</script>

<template>
  <section class="sec">
    <header id="catalog" class="sec-head">
      <div>
        <div class="eyebrow">Produits</div>
        <h2 class="sec-title">Catalogue</h2>
        <div class="sec-sub">{{ totalCount }} références — {{ filtered.length }} affichées</div>
      </div>
      <div class="sec-right">
        <button class="btn btn-primary">Nouveau produit</button>
      </div>
    </header>

    <div class="catalog-toolbar card">
      <div class="catalog-search">
        <Search :size="14" :stroke-width="1.5" />
        <input
          v-model="search"
          type="search"
          placeholder="Rechercher un produit"
        >
      </div>

      <div class="catalog-filters">
        <div class="filter-row" data-filter="category">
          <span class="filter-label">Catégorie</span>
          <button
            v-for="c in categoryChips"
            :key="c"
            class="chip"
            :class="{ 'is-active': activeCategory === c }"
            @click="activeCategory = c"
          >
            {{ c }}
          </button>
        </div>
        <div class="filter-row" data-filter="status">
          <span class="filter-label">Statut</span>
          <button
            v-for="s in statusChips"
            :key="s"
            class="chip"
            :class="{ 'is-active': activeStatus === s }"
            @click="activeStatus = s"
          >
            {{ s }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="filtered.length" class="catalog-grid">
      <NuxtLink
        v-for="p in filtered"
        :key="p.id"
        :to="`/products/${p.id}`"
        class="card product-card"
      >
        <div class="product-head">
          <div>
            <div class="product-name">{{ p.label }}</div>
            <div class="product-category">{{ p.category?.label }}</div>
          </div>
          <span class="badge" :class="badgeClass(p)">
            <span class="badge-dot" /> {{ productStatus(p) }}
          </span>
        </div>
        <div class="product-foot">
          <div class="product-stock">
            <span class="product-stock-num">{{ stockFr(p.currentStock ?? 0) }}</span>
            <span class="product-stock-unit">kg</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <div v-else class="card catalog-empty">
      Aucun produit ne correspond à votre recherche.
    </div>
  </section>
</template>
