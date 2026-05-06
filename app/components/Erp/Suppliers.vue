<script setup lang="ts">
import { Plus, FileBarChart } from 'lucide-vue-next'
import {
  SUPPLIERS, SUPPLIER_METRICS, SUPPLIER_STATUSES, SUPPLIER_CATEGORIES,
  type SupplierStatus, type SupplierCategory,
} from '~/data/erp'

type StatusFilter   = 'Tous' | SupplierStatus
type CategoryFilter = 'Toutes' | SupplierCategory

const statusFilter   = ref<StatusFilter>('Tous')
const categoryFilter = ref<CategoryFilter>('Toutes')

const statusChips: StatusFilter[]   = ['Tous', ...SUPPLIER_STATUSES]
const categoryChips: CategoryFilter[] = ['Toutes', ...SUPPLIER_CATEGORIES]

const filteredSuppliers = computed(() => {
  return SUPPLIERS.filter(s => {
    const matchStatus   = statusFilter.value === 'Tous'    || s.status === statusFilter.value
    const matchCategory = categoryFilter.value === 'Toutes' || s.category === categoryFilter.value
    return matchStatus && matchCategory
  })
})

function statusClass(s: SupplierStatus): string {
  if (s === 'Actif')    return 'is-active'
  if (s === 'Suspendu') return 'is-low'
  return 'is-inactive'
}
</script>

<template>
  <section class="sec">
    <header id="suppliers" class="sec-head">
      <div>
        <div class="eyebrow">Fournisseurs</div>
        <h2 class="sec-title">Annuaire</h2>
        <div class="sec-sub">Gestion des partenaires d'approvisionnement</div>
      </div>
      <div class="sec-right">
        <button class="btn btn-ghost">
          <FileBarChart :size="14" :stroke-width="1.5" /> Exporter
        </button>
        <button class="btn btn-primary">
          <Plus :size="14" :stroke-width="1.5" /> Nouveau fournisseur
        </button>
      </div>
    </header>

    <div class="metric-grid">
      <div v-for="m in SUPPLIER_METRICS" :key="m.label" class="card metric">
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
          <div class="card-title">Liste des fournisseurs</div>
          <div class="card-sub">{{ filteredSuppliers.length }} fournisseur{{ filteredSuppliers.length > 1 ? 's' : '' }}</div>
        </div>
        <div class="table-filters">
          <div class="table-actions" data-filter="category">
            <button
              v-for="chip in categoryChips"
              :key="chip"
              class="chip"
              :class="{ 'is-active': categoryFilter === chip }"
              @click="categoryFilter = chip"
            >
              {{ chip }}
            </button>
          </div>
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
            <th>Réf.</th>
            <th>Fournisseur</th>
            <th>Catégorie</th>
            <th>Contact</th>
            <th>Téléphone</th>
            <th>Dernière commande</th>
            <th class="num">Montant</th>
            <th class="num">Délai</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in filteredSuppliers" :key="s.id">
            <td class="muted">{{ s.id }}</td>
            <td class="strong">{{ s.name }}</td>
            <td class="muted">{{ s.category }}</td>
            <td>{{ s.contact }}</td>
            <td class="muted">{{ s.phone }}</td>
            <td class="muted">{{ s.lastOrder }}</td>
            <td class="num">{{ s.amount }}</td>
            <td class="num muted">{{ s.delay }}</td>
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
