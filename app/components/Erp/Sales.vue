<script setup lang="ts">
import { Plus, Receipt } from 'lucide-vue-next'
import { useSales, useCreateSale, type SaleSegment, type SaleRow } from '~/composables/useSales'

type SegmentFilter = 'Tous' | SaleSegment

const SALE_SEGMENTS: SaleSegment[] = ['Comptoir', 'Pro', 'Restaurant', 'Gros']

const filter = ref<SegmentFilter>('Tous')
const filterChips: SegmentFilter[] = ['Tous', ...SALE_SEGMENTS]

const salesQ = useSales()
const { data: salesData } = salesQ
const allSales = computed(() => (salesData.value?.data ?? []) as SaleRow[])

const filteredSales = computed(() => {
  if (filter.value === 'Tous') return allSales.value
  return allSales.value.filter(s => s.segment === filter.value)
})

const mutation = useCreateSale()

const fmtInt = (n: number) => Math.round(n).toLocaleString('fr-FR').replace(/ /g, ' ')

const metrics = computed(() => {
  const list = allSales.value
  const ticketCount = list.length
  const total = list.reduce((acc, s) => acc + (s.totalAmount ?? 0), 0)
  const avg = ticketCount > 0 ? total / ticketCount : 0

  const counts = new Map<SaleSegment, number>()
  for (const s of list) {
    if (!s.segment) continue
    counts.set(s.segment, (counts.get(s.segment) ?? 0) + 1)
  }
  let topSegment: SaleSegment | '' = ''
  let topCount = 0
  for (const [seg, n] of counts) {
    if (n > topCount) { topSegment = seg; topCount = n }
  }
  const topShare = ticketCount > 0 ? Math.round((topCount / ticketCount) * 100) : 0

  return [
    {
      label: "Chiffre d'affaires",
      value: fmtInt(total),
      unit: 'Ar',
      hint: `${ticketCount} ticket${ticketCount > 1 ? 's' : ''}`,
    },
    {
      label: 'Tickets émis',
      value: String(ticketCount),
      unit: '',
      hint: 'sur la période',
    },
    {
      label: 'Panier moyen',
      value: fmtInt(avg),
      unit: 'Ar',
      hint: `${ticketCount} ticket${ticketCount > 1 ? 's' : ''}`,
    },
    {
      label: 'Segment principal',
      value: String(topShare),
      unit: '%',
      hint: topSegment || '—',
    },
  ]
})

function statusClass(status?: string): string {
  if (status === 'paid')      return 'is-active'
  if (status === 'pending')   return 'is-low'
  return 'is-inactive'
}

function fmtDate(iso?: string | Date): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mn = String(d.getUTCMinutes()).padStart(2, '0')
  return `${dd}/${mm} ${hh}:${mn}`
}

function fmtAmount(amount?: number): string {
  if (amount == null) return '—'
  return amount.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' Ar'
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
        <button class="btn btn-primary" :disabled="mutation.isPending.value">
          <Plus :size="14" :stroke-width="1.5" /> Nouveau ticket
        </button>
      </div>
    </header>


    <div class="metric-grid">
      <div v-for="m in metrics" :key="m.label" class="card metric">
        <div class="metric-label">{{ m.label }}</div>
        <div class="metric-value">
          <span class="metric-num">{{ m.value }}</span>
          <span class="metric-unit">{{ m.unit }}</span>
        </div>
        <div class="metric-foot">
          <span class="metric-hint">{{ m.hint }}</span>
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
