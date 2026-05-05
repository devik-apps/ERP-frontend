<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { PRODUCTS, PRODUCT_CATEGORIES, PRODUCT_STATUSES, type ProductStatus } from '~/data/erp'

type CategoryFilter = 'Toutes' | typeof PRODUCT_CATEGORIES[number]
type StatusFilter = 'Tous' | ProductStatus

const search = ref('')
const activeCategory = ref<CategoryFilter>('Toutes')
const activeStatus = ref<StatusFilter>('Tous')

const categoryChips: CategoryFilter[] = ['Toutes', ...PRODUCT_CATEGORIES]
const statusChips: StatusFilter[] = ['Tous', ...PRODUCT_STATUSES]

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return PRODUCTS.filter(p => {
    if (q && !p.name.toLowerCase().includes(q)) return false
    if (activeCategory.value !== 'Toutes' && p.category !== activeCategory.value) return false
    if (activeStatus.value !== 'Tous' && p.status !== activeStatus.value) return false
    return true
  })
})

function badgeClass(s: ProductStatus) {
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
        <div class="sec-sub">15 références — {{ filtered.length }} affichées</div>
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
      <article
        v-for="p in filtered"
        :key="p.name"
        class="card product-card"
      >
        <div class="product-head">
          <div>
            <div class="product-name">{{ p.name }}</div>
            <div class="product-category">{{ p.category }}</div>
          </div>
          <span class="badge" :class="badgeClass(p.status)">
            <span class="badge-dot" /> {{ p.status }}
          </span>
        </div>
        <div class="product-foot">
          <div class="product-stock">
            <span class="product-stock-num">{{ stockFr(p.stock) }}</span>
            <span class="product-stock-unit">{{ p.unit }}</span>
          </div>
          <div class="product-price">{{ p.price }}</div>
        </div>
        <div class="product-origin muted">{{ p.origin }}</div>
      </article>
    </div>

    <div v-else class="card catalog-empty">
      Aucun produit ne correspond à votre recherche.
    </div>
  </section>
</template>
