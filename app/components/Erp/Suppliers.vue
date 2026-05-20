<script setup lang="ts">
import { Plus, FileBarChart } from 'lucide-vue-next'
import { useSuppliers } from '~/composables/useSuppliers'
import type { Supplier } from '@tsanta22kyle/erp-client'

type StatusFilter = 'Tous' | 'Actif' | 'Inactif'

const statusFilter = ref<StatusFilter>('Tous')
const statusChips: StatusFilter[] = ['Tous', 'Actif', 'Inactif']

const suppliersQ = useSuppliers()
const { data: suppliersData } = suppliersQ
const allSuppliers = computed(() => (suppliersData.value?.data ?? []) as Supplier[])
const hasApiError = computed(() => suppliersQ.isError.value)

const filteredSuppliers = computed(() => {
  if (statusFilter.value === 'Tous') return allSuppliers.value
  const wantActive = statusFilter.value === 'Actif'
  return allSuppliers.value.filter(s => Boolean(s.isActive) === wantActive)
})

const metrics = computed(() => {
  const list = allSuppliers.value
  const total = list.length
  const actifs = list.filter(s => s.isActive).length
  const inactifs = total - actifs
  const withContact = list.filter(s => Boolean(s.contact)).length
  return [
    { label: 'Total',        value: String(total),       unit: '', hint: 'fournisseurs' },
    { label: 'Actifs',       value: String(actifs),      unit: '', hint: 'isActive=true' },
    { label: 'Inactifs',     value: String(inactifs),    unit: '', hint: 'isActive=false' },
    { label: 'Avec contact', value: String(withContact), unit: '', hint: 'contact renseigné' },
  ]
})

function shortId(id?: string): string {
  if (!id) return '—'
  return id.length > 8 ? id.slice(0, 8) : id
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
          <div class="card-title">Liste des fournisseurs</div>
          <div class="card-sub">{{ filteredSuppliers.length }} fournisseur{{ filteredSuppliers.length > 1 ? 's' : '' }}</div>
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
            <th>Réf.</th>
            <th>Fournisseur</th>
            <th>Contact</th>
            <th>Description</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in filteredSuppliers" :key="s.id">
            <td class="muted">{{ shortId(s.id) }}</td>
            <td class="strong">{{ s.name }}</td>
            <td>{{ s.contact ?? '—' }}</td>
            <td class="muted">{{ s.description ?? '—' }}</td>
            <td>
              <span class="badge" :class="s.isActive ? 'is-active' : 'is-inactive'">
                <span class="badge-dot" /> {{ s.isActive ? 'Actif' : 'Inactif' }}
              </span>
            </td>
          </tr>
          <tr v-if="!filteredSuppliers.length" class="is-empty">
            <td colspan="5" class="muted">Aucun fournisseur</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
