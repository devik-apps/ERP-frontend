<script setup lang="ts">
import { Plus, FileBarChart } from 'lucide-vue-next'
import { useTransformations } from '~/composables/useTransformations'
import type { components } from '~/api/types.gen'

type Transformation = components['schemas']['Transformation']

const transformQ = useTransformations()
const { data: transformData } = transformQ
const allTransforms = computed(() => (transformData.value?.data ?? []) as Transformation[])
const totalLots = computed(() => transformData.value?.meta?.total ?? 0)
const hasApiError = computed(() => transformQ.isError.value)

const fmtKg = (g?: number) =>
  ((g ?? 0) / 1000).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function fmtDate(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}`
}

function fmtId(id?: string): string {
  if (!id) return '—'
  return id.length > 10 ? id.slice(0, 10) : id
}

const metrics = computed(() => {
  const list = allTransforms.value
  const count = list.length
  const avgYield = count > 0
    ? Math.round(
        (list.reduce((acc, t) => acc + (1 - (t.lossRatio ?? 0)), 0) / count) * 100,
      )
    : 0
  const totalLossKg = list.reduce((acc, t) => acc + ((t.totalLossGrams ?? 0) / 1000), 0)
  const activeCount = list.filter(t => t.isActive).length

  return [
    { label: 'Lots du mois',    value: String(totalLots.value), unit: 'lots', hint: 'mois en cours' },
    { label: 'Rendement moyen', value: String(avgYield),         unit: '%',    hint: `${count} lot${count > 1 ? 's' : ''}` },
    { label: 'Lots actifs',     value: String(activeCount),      unit: '',     hint: 'isActive=true' },
    { label: 'Pertes',          value: totalLossKg.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }), unit: 'kg', hint: 'cumul lots' },
  ]
})
</script>

<template>
  <section class="sec">
    <header id="transform" class="sec-head">
      <div>
        <div class="eyebrow">Transformations</div>
        <h2 class="sec-title">Atelier et lots</h2>
        <div class="sec-sub">Suivi des lots et rendements</div>
      </div>
      <div class="sec-right">
        <button class="btn btn-ghost">
          <FileBarChart :size="14" :stroke-width="1.5" /> Exporter
        </button>
        <button class="btn btn-primary">
          <Plus :size="14" :stroke-width="1.5" /> Nouveau lot
        </button>
      </div>
    </header>

    <div v-if="hasApiError" class="api-state is-error" role="alert">
      <span class="api-state-dot" /> API indisponible — affichage en mode hors ligne
    </div>

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
          <div class="card-title">Lots récents</div>
          <div class="card-sub">{{ allTransforms.length }} lot{{ allTransforms.length > 1 ? 's' : '' }}</div>
        </div>
      </div>

      <table class="tbl">
        <thead>
          <tr>
            <th>Lot</th>
            <th>Date</th>
            <th class="num">Entrée</th>
            <th class="num">Sortie</th>
            <th class="num">Pertes</th>
            <th class="num">Rendement</th>
            <th>Actif</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in allTransforms" :key="t.id">
            <td class="strong">{{ fmtId(t.id) }}</td>
            <td class="muted">{{ fmtDate(t.transformedAt) }}</td>
            <td class="num">{{ fmtKg(t.totalInputWeightGrams) }} kg</td>
            <td class="num">{{ fmtKg(t.totalOutputWeightGrams) }} kg</td>
            <td class="num muted">{{ fmtKg(t.totalLossGrams) }} kg</td>
            <td class="num strong">{{ Math.round((1 - (t.lossRatio ?? 0)) * 100) }} %</td>
            <td>
              <span class="badge" :class="t.isActive ? 'is-active' : 'is-inactive'">
                <span class="badge-dot" /> {{ t.isActive ? 'Actif' : 'Inactif' }}
              </span>
            </td>
          </tr>
          <tr v-if="!allTransforms.length" class="is-empty">
            <td colspan="7" class="muted">Aucun lot</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
