<script setup lang="ts">
import { Plus, Receipt } from 'lucide-vue-next'
import { SALES, SALES_METRICS, SALES_SEGMENTS, type SalesSegment, type SaleStatus } from '~/data/erp'

type SegmentFilter = 'Tous' | SalesSegment

const filter = ref<SegmentFilter>('Tous')

const filterChips: SegmentFilter[] = ['Tous', ...SALES_SEGMENTS]

const filteredSales = computed(() => {
  if (filter.value === 'Tous') return SALES
  return SALES.filter(s => s.segment === filter.value)
})

function statusClass(s: SaleStatus): string {
  if (s === 'Payé')       return 'is-active'
  if (s === 'En attente') return 'is-low'
  return 'is-inactive'
}
</script>

<template>
  <section class="sec">
    <header id="sales" class="sec-head">
      <div>
        <div class="eyebrow">Ventes</div>
        <h2 class="sec-title">Activité commerciale</h2>
        <div class="sec-sub">Tickets et chiffre d'affaires du jour</div>
      </div>
      <div class="sec-right">
        <button class="btn btn-ghost">
          <Receipt :size="14" :stroke-width="1.5" /> Exporter
        </button>
        <button class="btn btn-primary">
          <Plus :size="14" :stroke-width="1.5" /> Nouveau ticket
        </button>
      </div>
    </header>

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
          <div class="card-title">Tickets récents</div>
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
            <th>N°</th>
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
            <td class="muted">{{ s.time }}</td>
            <td>{{ s.segment }}</td>
            <td class="muted">{{ s.top }}</td>
            <td class="num">{{ s.items }}</td>
            <td class="num strong">{{ s.total }}</td>
            <td>
              <span class="badge" :class="statusClass(s.status)">
                <span class="badge-dot" /> {{ s.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
