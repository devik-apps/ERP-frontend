<script setup lang="ts">
import { METRICS, MOVEMENTS } from '~/data/erp'

type Filter = 'Tous' | 'Entrée' | 'Sortie'

const filter = ref<Filter>('Tous')

const filteredMovements = computed(() => {
  if (filter.value === 'Tous') return MOVEMENTS
  return MOVEMENTS.filter(m => m.type === filter.value)
})

const filterChips: { label: string, value: Filter }[] = [
  { label: 'Tous',    value: 'Tous'   },
  { label: 'Entrées', value: 'Entrée' },
  { label: 'Sorties', value: 'Sortie' },
]
</script>

<template>
  <section class="sec">
    <header id="dashboard" class="sec-head">
      <div>
        <div class="eyebrow">Aperçu</div>
        <h2 class="sec-title">Tableau de bord</h2>
        <div class="sec-sub">Lundi 4 mai 2026 — 10:14</div>
      </div>
      <div class="sec-right">
        <button class="btn btn-ghost">Exporter le rapport</button>
      </div>
    </header>

    <div class="metric-grid">
      <div v-for="m in METRICS" :key="m.label" class="card metric">
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
          <div class="card-title">Mouvements de stock récents</div>
          <div class="card-sub">11 dernières opérations</div>
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
            <th>Date</th>
            <th>Saisi par</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(m, i) in filteredMovements" :key="i">
            <td class="strong">{{ m.product }}</td>
            <td>
              <span class="mv-pill" :class="m.type === 'Entrée' ? 'is-in' : 'is-out'">
                <span class="mv-dot" /> {{ m.type }}
              </span>
            </td>
            <td class="num">{{ m.qty }}</td>
            <td class="num">{{ m.weight }}</td>
            <td class="muted">{{ m.origin }}</td>
            <td class="muted">{{ m.time }}</td>
            <td class="muted">{{ m.user }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
