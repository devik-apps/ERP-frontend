<script setup lang="ts">
import { useStockSummary, useTransformationCount } from '~/composables/useDashboard'
import { useProducts } from '~/composables/useProducts'
import { useSales } from '~/composables/useSales'
import { useStockMovements } from '~/composables/useStock'

type Filter = 'Tous' | 'Entrée' | 'Sortie'
const filter = ref<Filter>('Tous')

const stockSummaryQ  = useStockSummary()
const productsQ      = useProducts()
const salesQ         = useSales()
const movementsQ     = useStockMovements()
const transformQ     = useTransformationCount()

const { data: stockSummary }  = stockSummaryQ
const { data: productsData }  = productsQ
const { data: salesData }     = salesQ
const { data: movementsData } = movementsQ
const { data: transformData } = transformQ

const hasApiError = computed(() =>
  stockSummaryQ.isError.value
  || productsQ.isError.value
  || salesQ.isError.value
  || movementsQ.isError.value
  || transformQ.isError.value,
)

function frFR(n: number, opts?: Intl.NumberFormatOptions) {
  return n.toLocaleString('fr-FR', opts).replace(/ /g, ' ')
}

const stockTotalKg = computed(() => {
  const g = (stockSummary.value?.data ?? []).reduce((s, p) => s + (p.totalWeightGrams ?? 0), 0)
  return g / 1000
})

const stockTotalFormatted = computed(() =>
  frFR(stockTotalKg.value, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
)

const stockRefCount = computed(() => stockSummary.value?.data?.length ?? 0)

const salesTotalEuros = computed(() => {
  const cents = (salesData.value?.data ?? []).reduce((s, v) => s + (v.totalAmount ?? 0), 0)
  return Math.round(cents / 100)
})

const salesTotalFormatted = computed(() => frFR(salesTotalEuros.value))

const salesTicketCount = computed(() => salesData.value?.data?.length ?? 0)

const activeCount   = computed(() => (productsData.value?.data ?? []).filter(p => p.isActive).length)
const totalCount    = computed(() => productsData.value?.data?.length ?? 0)
const inactiveCount = computed(() => totalCount.value - activeCount.value)

const transformTotal = computed(() => transformData.value?.meta?.total ?? 0)

const movements = computed(() => movementsData.value?.data ?? [])

const filteredMovements = computed(() => {
  if (filter.value === 'Tous') return movements.value
  const type = filter.value === 'Entrée' ? 'entry' : 'exit'
  return movements.value.filter(m => m.type === type)
})

const filterChips: { label: string; value: Filter }[] = [
  { label: 'Tous',    value: 'Tous'   },
  { label: 'Entrées', value: 'Entrée' },
  { label: 'Sorties', value: 'Sortie' },
]

function fmtWeight(g?: number) {
  if (g == null) return '—'
  return g >= 1000
    ? `${frFR(g / 1000, { maximumFractionDigits: 1 })} kg`
    : `${g} g`
}
</script>

<template>
  <section class="sec">
    <header id="dashboard" class="sec-head">
      <div>
        <div class="eyebrow">Aperçu</div>
        <h2 class="sec-title">Tableau de bord</h2>
        <div class="sec-sub">{{ new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</div>
      </div>
      <div class="sec-right">
        <button class="btn btn-ghost">Exporter le rapport</button>
      </div>
    </header>

    <div v-if="hasApiError" class="api-state is-error" role="alert">
      <span class="api-state-dot" /> API indisponible — affichage en mode hors ligne
    </div>

    <div class="metric-grid">
      <div class="card metric">
        <div class="metric-label">Stock total</div>
        <div class="metric-value">
          <span class="metric-num">{{ stockTotalFormatted }}</span>
          <span class="metric-unit">kg</span>
        </div>
        <div class="metric-foot">
          <span class="metric-hint">{{ stockRefCount }} références</span>
        </div>
      </div>

      <div class="card metric">
        <div class="metric-label">Ventes du jour</div>
        <div class="metric-value">
          <span class="metric-num">{{ salesTotalFormatted }}</span>
          <span class="metric-unit">€</span>
        </div>
        <div class="metric-foot">
          <span class="metric-hint">{{ salesTicketCount }} tickets</span>
        </div>
      </div>

      <div class="card metric">
        <div class="metric-label">Produits actifs</div>
        <div class="metric-value">
          <span class="metric-num">{{ activeCount }}</span>
          <span class="metric-unit">/ {{ totalCount }}</span>
        </div>
        <div class="metric-foot">
          <span class="metric-hint">{{ inactiveCount }} désactivé{{ inactiveCount > 1 ? 's' : '' }}</span>
        </div>
      </div>

      <div class="card metric">
        <div class="metric-label">Transformations</div>
        <div class="metric-value">
          <span class="metric-num">{{ transformTotal }}</span>
          <span class="metric-unit">lots</span>
        </div>
        <div class="metric-foot">
          <span class="metric-hint">ce mois</span>
        </div>
      </div>
    </div>

    <div class="card table-card">
      <div class="table-head">
        <div>
          <div class="card-title">Mouvements de stock récents</div>
          <div class="card-sub">{{ movements.length }} dernières opérations</div>
        </div>
        <div class="table-actions">
          <button
            v-for="chip in filterChips"
            :key="chip.value"
            class="chip"
            :class="{ 'is-active': filter === chip.value }"
            @click="filter = chip.value"
          >
            {{ chip.label }}
          </button>
        </div>
      </div>

      <table class="tbl">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Type</th>
            <th class="num">Quantité</th>
            <th class="num">Poids</th>
            <th>Origine</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in filteredMovements" :key="m.id">
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
          <tr v-if="!filteredMovements.length" class="is-empty">
            <td colspan="5" class="muted">Aucun mouvement</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
