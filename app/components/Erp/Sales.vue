<script setup lang="ts">
import { Plus, Receipt } from 'lucide-vue-next'
import { useSales } from '~/composables/useSales'
import type { SaleSummary } from '@tsanta22kyle/erp-client'

type StatusFilter = 'Tous' | 'Actif' | 'Inactif'

const statusFilter = ref<StatusFilter>('Tous')
const statusChips: StatusFilter[] = ['Tous', 'Actif', 'Inactif']

const salesQ = useSales()
const { data: salesData } = salesQ
const allSales = computed(() => (salesData.value?.data ?? []) as SaleSummary[])

const filteredSales = computed(() => {
  if (statusFilter.value === 'Tous') return allSales.value
  const wantActive = statusFilter.value === 'Actif'
  return allSales.value.filter(s => Boolean(s.isActive) === wantActive)
})

const showCreate = ref(false)

const fmtInt = (n: number) => Math.round(n).toLocaleString('fr-FR').replace(/ /g, ' ')

const metrics = computed(() => {
  const list = allSales.value
  const ticketCount = list.length
  const total = list.reduce((acc, s) => acc + (s.totalAmount ?? 0), 0)
  const avg = ticketCount > 0 ? total / ticketCount : 0
  const items = list.reduce((acc, s) => acc + (s.itemCount ?? 0), 0)

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
      label: 'Articles vendus',
      value: fmtInt(items),
      unit: '',
      hint: 'toutes ventes',
    },
  ]
})

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
        <button class="btn btn-primary" @click="showCreate = true">
          <Plus :size="14" :stroke-width="1.5" /> Nouveau ticket
        </button>
      </div>
    </header>

    <UiModal :open="showCreate" title="Nouveau ticket" @close="showCreate = false">
      <ErpSaleForm @submitted="showCreate = false" @cancel="showCreate = false" />
    </UiModal>

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
          <div class="card-sub">
            {{ filteredSales.length }} ticket{{ filteredSales.length > 1 ? 's' : '' }}
          </div>
        </div>
        <div class="table-filters">
          <div class="table-actions" data-filter="status">
            <button
              v-for="chip in statusChips"
              :key="chip"
              class="chip"
              :class="{ 'is-active': statusFilter === chip }"
              @click="statusFilter = chip"
            >
              {{ chip }}
            </button>
          </div>
        </div>
      </div>

      <table class="tbl">
        <thead>
          <tr>
            <th>N°</th>
            <th>Date</th>
            <th class="num">Articles</th>
            <th class="num">Montant</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in filteredSales" :key="s.id">
            <td class="strong">{{ s.id }}</td>
            <td class="muted">{{ fmtDate(s.saleDate) }}</td>
            <td class="num">{{ s.itemCount }}</td>
            <td class="num strong">{{ fmtAmount(s.totalAmount) }}</td>
            <td>
              <span class="badge" :class="s.isActive ? 'is-active' : 'is-inactive'">
                <span class="badge-dot" /> {{ s.isActive ? 'Actif' : 'Inactif' }}
              </span>
            </td>
          </tr>
          <tr v-if="!filteredSales.length" class="is-empty">
            <td colspan="5" class="muted">Aucun ticket</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
