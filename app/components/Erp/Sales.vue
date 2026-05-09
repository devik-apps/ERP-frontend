<script setup lang="ts">
import { Plus, Receipt } from 'lucide-vue-next'
import { SALES_METRICS } from '~/data/erp'
import { useSales, useCreateSale, type SaleSegment, type SaleRow } from '~/composables/useSales'

type SegmentFilter = 'Tous' | SaleSegment

const SALE_SEGMENTS: SaleSegment[] = ['Comptoir', 'Pro', 'Restaurant', 'Gros']

const filter = ref<SegmentFilter>('Tous')
const filterChips: SegmentFilter[] = ['Tous', ...SALE_SEGMENTS]

const salesQ = useSales()
const { data: salesData } = salesQ
const allSales = computed(() => (salesData.value?.data ?? []) as SaleRow[])
const hasApiError = computed(() => salesQ.isError.value)

const filteredSales = computed(() => {
  if (filter.value === 'Tous') return allSales.value
  return allSales.value.filter(s => s.segment === filter.value)
})

const mutation = useCreateSale()

function statusClass(status?: string): string {
  if (status === 'paid')      return 'is-active'
  if (status === 'pending')   return 'is-low'
  return 'is-inactive'
}

function fmtDate(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mn = String(d.getUTCMinutes()).padStart(2, '0')
  return `${dd}/${mm} ${hh}:${mn}`
}

function fmtAmount(cents?: number): string {
  if (cents == null) return '—'
  return (cents / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}
</script>

<template>
  <section class="sec">
    <header id="sales" class="sec-head">
      <div>
        <div class="eyebrow">Ventes</div>
        <h2 class="sec-title">Activite commerciale</h2>
        <div class="sec-sub">Tickets et chiffre d'affaires du jour</div>
      </div>
      <div class="sec-right">
        <button class="btn btn-ghost">
          <Receipt :size="14" :stroke-width="1.5" /> Exporter
        </button>
        <button class="btn btn-primary" :disabled="mutation.isPending.value">
          <Plus :size="14" :stroke-width="1.5" /> Nouveau ticket
        </button>
      </div>
    </header>

    <div v-if="hasApiError" class="api-state is-error" role="alert">
      <span class="api-state-dot" /> API indisponible — affichage en mode hors ligne
    </div>

    <div class="metric-grid">
      <div v-for="m in SALES_METRICS" :key="m.label" class="card metric">
        <div class="metric-label">{{ m.label }}</div>
        <div class="metric-value">
          <span class="metric-num">{{ m.value }}</span>
          <span class="metric-unit">{{ m.unit }}</span>
        </div>
        <div class="metric-foot">
          <span class="metric-hint">{{ m.hint }}</span>
          <span class="metric-delta" :class="m.up ? 'is-up' : 'is-flat'">{{ m.delta }}</span>
        </div>
      </div>
    </div>

    <div class="card table-card">
      <div class="table-head">
        <div>
          <div class="card-title">Tickets</div>
          <div class="card-sub">12 dernières ventes</div>
        </div>
        <div class="table-actions">
          <button
            v-for="chip in filterChips"
            :key="chip"
            class="chip"
            :class="{ 'is-active': filter === chip }"
            @click="filter = chip"
          >
            {{ chip }}
          </button>
        </div>
      </div>

      <table class="tbl">
        <thead>
          <tr>
            <th>N</th>
            <th>Heure</th>
            <th>Segment</th>
            <th>Produit principal</th>
            <th class="num">Articles</th>
            <th class="num">Montant</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in filteredSales" :key="s.id">
            <td class="strong">{{ s.id }}</td>
            <td class="muted">{{ fmtDate(s.saleDate) }}</td>
            <td>{{ s.segment }}</td>
            <td class="muted">{{ s.top }}</td>
            <td class="num">{{ s.itemCount }}</td>
            <td class="num strong">{{ fmtAmount(s.totalAmount) }}</td>
            <td>
              <span class="badge" :class="statusClass(s.status)">
                <span class="badge-dot" /> {{ s.status }}
              </span>
            </td>
          </tr>
          <tr v-if="!filteredSales.length" class="is-empty">
            <td colspan="7" class="muted">Aucun ticket</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
