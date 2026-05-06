<script setup lang="ts">
import { Pencil, Plus } from 'lucide-vue-next'
import { useProduct, useProductStock, useProductPrices, productStatus } from '~/composables/useProducts'

const props = defineProps<{ id: string }>()

const { data: product } = useProduct(() => props.id)
const { data: stock } = useProductStock(() => props.id)
const { data: pricesData } = useProductPrices(() => props.id)

const prices = computed(() => pricesData.value?.data ?? [])

const stockItems = computed(() => [
  { label: 'Stock total', value: stock.value?.totalQuantity ?? 0,             unit: 'kg', tone: 'is-total'     },
  { label: 'Poids',       value: (stock.value?.totalWeightGrams ?? 0) / 1000, unit: 'kg', tone: 'is-available' },
])

const stockRatio = computed(() => {
  const total = stock.value?.totalQuantity ?? 0
  const threshold = 10
  if (threshold === 0) return 100
  return Math.min(100, Math.round((total / (threshold * 2)) * 100))
})

function fr(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

function formatPrice(amount: number, weightGrams: number): string {
  const pricePerKg = (amount / 100) / (weightGrams / 1000)
  return pricePerKg.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €/kg'
}

function badgeClass() {
  if (!product.value) return ''
  const s = productStatus(product.value)
  if (s === 'Stock bas') return 'is-low'
  if (s === 'Inactif')   return 'is-inactive'
  return 'is-active'
}
</script>

<template>
  <section class="sec">
    <header id="product" class="sec-head">
      <div>
        <div class="eyebrow">Fiche produit</div>
        <h2 class="sec-title">{{ product?.label }}</h2>
        <div class="sec-sub">{{ product?.id }} — {{ product?.category?.label }}</div>
      </div>
      <div class="sec-right">
        <button class="btn btn-primary">
          <Plus :size="14" :stroke-width="1.5" /> Mouvement
        </button>
        <button class="btn">
          <Pencil :size="14" :stroke-width="1.5" /> Éditer
        </button>
      </div>
    </header>

    <div class="product-grid">
      <article class="card product-summary">
        <div class="product-summary-head">
          <div>
            <div class="card-title">{{ product?.label }}</div>
            <div class="card-sub">{{ product?.category?.label }}</div>
          </div>
          <span v-if="product" class="badge" :class="badgeClass()">
            <span class="badge-dot" /> {{ productStatus(product) }}
          </span>
        </div>

        <p class="product-description">{{ product?.description }}</p>

        <dl class="product-meta">
          <div>
            <dt>Référence</dt>
            <dd>{{ product?.id }}</dd>
          </div>
          <div>
            <dt>Catégorie</dt>
            <dd>{{ product?.category?.label }}</dd>
          </div>
          <div>
            <dt>Unité</dt>
            <dd>kg</dd>
          </div>
        </dl>
      </article>

      <article class="card product-stock-card">
        <div class="card-title">Niveau de stock</div>
        <div v-if="stock?.lastMovementAt" class="card-sub">
          Dernière mise à jour {{ new Date(stock.lastMovementAt).toLocaleDateString('fr-FR') }}
        </div>

        <div class="stock-items">
          <div
            v-for="s in stockItems"
            :key="s.label"
            class="stock-item"
            :class="s.tone"
          >
            <div class="stock-item-label">{{ s.label }}</div>
            <div class="stock-item-value">
              <span class="stock-item-num">{{ fr(s.value) }}</span>
              <span class="stock-item-unit">{{ s.unit }}</span>
            </div>
          </div>
        </div>

        <div class="stock-bar" :aria-valuenow="stockRatio" aria-valuemin="0" aria-valuemax="100">
          <div class="stock-bar-fill" :style="{ width: stockRatio + '%' }" />
        </div>
        <div class="stock-bar-legend">
          <span class="muted small">{{ stockRatio }} % du seuil</span>
        </div>
      </article>
    </div>

    <div class="card table-card product-prices">
      <div class="table-head">
        <div>
          <div class="card-title">Tableau des prix</div>
          <div class="card-sub">{{ prices.length }} tarifs actifs</div>
        </div>
      </div>
      <table class="tbl">
        <thead>
          <tr>
            <th>Conditionnement</th>
            <th class="num">Prix</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in prices" :key="row.id">
            <td class="strong">{{ row.packaging?.label }}</td>
            <td class="num">{{ formatPrice(row.amount ?? 0, row.weightGrams ?? 1000) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
