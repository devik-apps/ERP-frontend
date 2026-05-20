<script setup lang="ts">
import { useProducts, productStatus } from '~/composables/useProducts'
import { useStockMovements } from '~/composables/useStock'

const productsQ = useProducts()
const movementsQ = useStockMovements()
const { data: productsData } = productsQ
const { data: movementsData } = movementsQ

const hasApiError = computed(() => productsQ.isError.value || movementsQ.isError.value)

const products = computed(() => productsData.value?.data ?? [])
const movements = computed(() => movementsData.value?.data ?? [])

function fmtKg(n: number): string {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

function fmtWeight(g?: number) {
  if (g == null) return '—'
  return g >= 1000
    ? `${(g / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} kg`
    : `${g} g`
}

function badgeClass(p: { isActive?: boolean; currentStock?: number }) {
  const s = productStatus(p)
  if (s === 'Stock bas') return 'is-low'
  if (s === 'Inactif')   return 'is-inactive'
  return 'is-active'
}
</script>

<template>
  <section class="sec">
    <header id="stock" class="sec-head">
      <div>
        <div class="eyebrow">Stock</div>
        <h2 class="sec-title">État du stock</h2>
        <div class="sec-sub">Vue synthétique en lecture seule — modifier le stock depuis la fiche produit</div>
      </div>
    </header>

    <div v-if="hasApiError" class="api-state is-error" role="alert">
      <span class="api-state-dot" /> API indisponible — affichage en mode hors ligne
    </div>

    <div class="card table-card">
      <div class="table-head">
        <div>
          <div class="card-title">Stock par produit</div>
          <div class="card-sub">{{ products.length }} référence{{ products.length > 1 ? 's' : '' }}</div>
        </div>
      </div>
      <table class="tbl" data-table="stock">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Catégorie</th>
            <th class="num">Stock</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td class="strong">{{ p.label }}</td>
            <td class="muted">{{ p.category?.label }}</td>
            <td class="num">{{ fmtKg(p.currentStock ?? 0) }} kg</td>
            <td>
              <span class="badge" :class="badgeClass(p)">
                <span class="badge-dot" /> {{ productStatus(p) }}
              </span>
            </td>
          </tr>
          <tr v-if="!products.length" class="is-empty">
            <td colspan="4" class="muted">Aucun produit</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card table-card">
      <div class="table-head">
        <div>
          <div class="card-title">Mouvements récents</div>
          <div class="card-sub">{{ movements.length }} dernière{{ movements.length > 1 ? 's' : '' }} opération{{ movements.length > 1 ? 's' : '' }}</div>
        </div>
      </div>
      <table class="tbl" data-table="movements">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Type</th>
            <th class="num">Quantité</th>
            <th class="num">Poids</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in movements" :key="m.id">
            <td class="strong">{{ m.product?.label }}</td>
            <td>
              <span class="mv-pill" :class="m.type === 'entry' ? 'is-in' : 'is-out'">
                <span class="mv-dot" /> {{ m.type === 'entry' ? 'Entrée' : 'Sortie' }}
              </span>
            </td>
            <td class="num">{{ m.quantity }}</td>
            <td class="num">{{ fmtWeight(m.weightGrams) }}</td>
            <td class="muted">{{ m.description ?? m.origin }}</td>
          </tr>
          <tr v-if="!movements.length" class="is-empty">
            <td colspan="5" class="muted">Aucun mouvement</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
