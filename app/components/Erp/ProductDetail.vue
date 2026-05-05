<script setup lang="ts">
import { Pencil, Plus } from 'lucide-vue-next'
import { PRODUCT_DETAIL } from '~/data/erp'

const p = PRODUCT_DETAIL

function fr(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

const stockItems = [
  { label: 'Stock total', value: p.stock,     unit: p.unit, tone: 'is-total' },
  { label: 'Disponible',  value: p.available, unit: p.unit, tone: 'is-available' },
  { label: 'Réservé',     value: p.reserved,  unit: p.unit, tone: 'is-reserved' },
  { label: 'Seuil bas',   value: p.threshold, unit: p.unit, tone: 'is-threshold' },
]

const stockRatio = computed(() => Math.min(100, Math.round((p.available / p.stock) * 100)))

function badgeClass() {
  if (p.status === 'Stock bas') return 'is-low'
  if (p.status === 'Inactif')   return 'is-inactive'
  return 'is-active'
}
</script>

<template>
  <section class="sec">
    <header id="product" class="sec-head">
      <div>
        <div class="eyebrow">Fiche produit</div>
        <h2 class="sec-title">{{ p.name }}</h2>
        <div class="sec-sub">{{ p.ref }} — {{ p.category }}</div>
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
            <div class="card-title">{{ p.name }}</div>
            <div class="card-sub">{{ p.category }}</div>
          </div>
          <span class="badge" :class="badgeClass()">
            <span class="badge-dot" /> {{ p.status }}
          </span>
        </div>

        <p class="product-description">{{ p.description }}</p>

        <dl class="product-meta">
          <div>
            <dt>Référence</dt>
            <dd>{{ p.ref }}</dd>
          </div>
          <div>
            <dt>Origine</dt>
            <dd>{{ p.origin }}</dd>
          </div>
          <div>
            <dt>Unité</dt>
            <dd>{{ p.unit }}</dd>
          </div>
          <div>
            <dt>Prix de vente</dt>
            <dd>{{ p.price }}</dd>
          </div>
        </dl>
      </article>

      <article class="card product-stock-card">
        <div class="card-title">Niveau de stock</div>
        <div class="card-sub">Mis à jour aujourd'hui à 10:14</div>

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
          <span class="muted small">{{ stockRatio }} % disponible</span>
          <span class="muted small">Seuil bas à {{ fr(p.threshold) }} {{ p.unit }}</span>
        </div>
      </article>
    </div>

    <div class="card table-card product-prices">
      <div class="table-head">
        <div>
          <div class="card-title">Tableau des prix</div>
          <div class="card-sub">{{ p.prices.length }} segments commerciaux</div>
        </div>
      </div>
      <table class="tbl">
        <thead>
          <tr>
            <th>Segment</th>
            <th class="num">Achat</th>
            <th class="num">Vente</th>
            <th class="num">Marge</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in p.prices" :key="row.segment">
            <td class="strong">{{ row.segment }}</td>
            <td class="num muted">{{ row.cost }}</td>
            <td class="num">{{ row.price }}</td>
            <td class="num strong">{{ row.margin }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
