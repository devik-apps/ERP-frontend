<script setup lang="ts">
import { Plus, FileBarChart } from 'lucide-vue-next'
import { TRANSFORMS, TRANSFORM_METRICS, TRANSFORM_STATUSES, type TransformStatus } from '~/data/erp'

type StatusFilter = 'Tous' | TransformStatus

const filter = ref<StatusFilter>('Tous')

const filterChips: StatusFilter[] = ['Tous', ...TRANSFORM_STATUSES]

const filteredLots = computed(() => {
  if (filter.value === 'Tous') return TRANSFORMS
  return TRANSFORMS.filter(t => t.status === filter.value)
})

function statusClass(s: TransformStatus): string {
  if (s === 'Terminé')  return 'is-active'
  if (s === 'En cours') return 'is-low'
  return 'is-inactive'
}
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

    <div class="metric-grid">
      <div v-for="m in TRANSFORM_METRICS" :key="m.label" class="card metric">
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
          <div class="card-title">Lots récents</div>
          <div class="card-sub">12 derniers lots</div>
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
            <th>Lot</th>
            <th>Date</th>
            <th>Matière</th>
            <th>Produit fini</th>
            <th class="num">Entrée</th>
            <th class="num">Sortie</th>
            <th class="num">Rendement</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in filteredLots" :key="t.id">
            <td class="strong">{{ t.id }}</td>
            <td class="muted">{{ t.date }}</td>
            <td>{{ t.source }}</td>
            <td class="muted">{{ t.output }}</td>
            <td class="num">{{ t.inputKg }}</td>
            <td class="num">{{ t.outputKg }}</td>
            <td class="num strong">{{ t.yield }}</td>
            <td>
              <span class="badge" :class="statusClass(t.status)">
                <span class="badge-dot" /> {{ t.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
