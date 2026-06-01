<script setup lang="ts">
import { Pencil, Plus, Trash2 } from 'lucide-vue-next'
import type { ProductPrice } from '@tsanta22kyle/erp-client'
import {
  useProduct,
  useProductStock,
  useProductPrices,
  useDeleteProductPrice,
  productStatus,
} from '~/composables/useProducts'

const props = defineProps<{ id: string }>()

const productQ = useProduct(() => props.id)
const stockQ = useProductStock(() => props.id)
const pricesQ = useProductPrices(() => props.id)
const { data: product } = productQ
const { data: stock } = stockQ
const { data: pricesData } = pricesQ

const movementOpen = ref(false)
const editOpen = ref(false)
const priceFormOpen = ref(false)
const editingPrice = ref<ProductPrice | undefined>(undefined)
const priceToDelete = ref<ProductPrice | null>(null)

const deletePrice = useDeleteProductPrice()

function openCreatePrice() {
  editingPrice.value = undefined
  priceFormOpen.value = true
}

function openEditPrice(p: ProductPrice) {
  editingPrice.value = p
  priceFormOpen.value = true
}

function closePriceForm() {
  priceFormOpen.value = false
  editingPrice.value = undefined
}

function askDelete(p: ProductPrice) {
  priceToDelete.value = p
}

function cancelDelete() {
  priceToDelete.value = null
}

function confirmDelete() {
  const target = priceToDelete.value
  if (!target?.id) return
  deletePrice.mutate(
    { id: target.id, productId: props.id },
    { onSuccess: () => { priceToDelete.value = null } },
  )
}

const movementProduct = computed(() => ({
  id: product.value?.id ?? props.id,
  label: product.value?.label ?? '',
  currentStock: stock.value?.totalQuantity ?? product.value?.currentStock ?? 0,
}))

const prices = computed(() => pricesData.value?.data ?? [])

const stockItems = computed(() => [
  { label: 'Quantité', text: frInt(stock.value?.totalQuantity ?? 0),           unit: '',   tone: 'is-total'     },
  { label: 'Poids',    text: fr((stock.value?.totalWeightGrams ?? 0) / 1000),  unit: 'kg', tone: 'is-available' },
])

const stockRatio = computed(() => {
  const total = stock.value?.totalQuantity ?? 0
  const threshold = 10
  return Math.min(100, Math.round((total / (threshold * 2)) * 100))
})

function fr(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

function frInt(n: number) {
  return n.toLocaleString('fr-FR', { maximumFractionDigits: 0 })
}

function formatPrice(amount: number, weightGrams: number): string {
  const pricePerKg = amount / (weightGrams / 1000)
  return pricePerKg.toLocaleString('fr-FR', { maximumFractionDigits: 0 }).replace(/ /g, ' ') + ' Ar/kg'
}

function badgeClass() {
  if (!product.value) return ''
  const s = productStatus(product.value)
  if (s === 'Stock bas') return 'is-low'
  if (s === 'Inactif')   return 'is-inactive'
  return 'is-active'
}
</script>

<template>
  <section class="sec">
    <header id="product" class="sec-head">
      <div>
        <div class="eyebrow">Fiche produit</div>
        <h2 class="sec-title">{{ product?.label }}</h2>
        <div class="sec-sub">{{ product?.id }} — {{ product?.category?.label }}</div>
      </div>
      <div class="sec-right">
        <button class="btn btn-primary" data-action="new-movement" @click="movementOpen = true">
          <Plus :size="14" :stroke-width="1.5" /> Mouvement
        </button>
        <button class="btn" data-action="edit-product" @click="editOpen = true">
          <Pencil :size="14" :stroke-width="1.5" /> Éditer
        </button>
      </div>
    </header>

    <div class="product-grid">
      <article class="card product-summary">
        <div class="product-summary-head">
          <div>
            <div class="card-title">{{ product?.label }}</div>
            <div class="card-sub">{{ product?.category?.label }}</div>
          </div>
          <span v-if="product" class="badge" :class="badgeClass()">
            <span class="badge-dot" /> {{ productStatus(product) }}
          </span>
        </div>

        <p class="product-description">{{ product?.description }}</p>

        <dl class="product-meta">
          <div>
            <dt>Référence</dt>
            <dd>{{ product?.id }}</dd>
          </div>
          <div>
            <dt>Catégorie</dt>
            <dd>{{ product?.category?.label }}</dd>
          </div>
          <div>
            <dt>Unité</dt>
            <dd>kg</dd>
          </div>
        </dl>
      </article>

      <article class="card product-stock-card">
        <div class="card-title">Niveau de stock</div>
        <div v-if="stock?.lastMovementAt" class="card-sub">
          Dernière mise à jour {{ new Date(stock.lastMovementAt).toLocaleDateString('fr-FR') }}
        </div>

        <div class="stock-items">
          <div
            v-for="s in stockItems"
            :key="s.label"
            class="stock-item"
            :class="s.tone"
          >
            <div class="stock-item-label">{{ s.label }}</div>
            <div class="stock-item-value">
              <span class="stock-item-num">{{ s.text }}</span>
              <span class="stock-item-unit">{{ s.unit }}</span>
            </div>
          </div>
        </div>

        <div class="stock-bar" :aria-valuenow="stockRatio" aria-valuemin="0" aria-valuemax="100">
          <div class="stock-bar-fill" :style="{ width: stockRatio + '%' }" />
        </div>
        <div class="stock-bar-legend">
          <span class="muted small">{{ stockRatio }} % du seuil</span>
        </div>
      </article>
    </div>

    <div class="card table-card product-prices">
      <div class="table-head">
        <div>
          <div class="card-title">Tableau des prix</div>
          <div class="card-sub">{{ prices.length }} tarif{{ prices.length > 1 ? 's' : '' }} actif{{ prices.length > 1 ? 's' : '' }}</div>
        </div>
        <div class="table-actions">
          <button class="btn btn-sm btn-primary" data-action="new-price" @click="openCreatePrice">
            <Plus :size="13" :stroke-width="1.5" /> Ajouter un prix
          </button>
        </div>
      </div>
      <table class="tbl">
        <thead>
          <tr>
            <th>Conditionnement</th>
            <th class="num">Prix</th>
            <th class="num">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in prices" :key="row.id">
            <td class="strong">{{ row.packaging?.label }}</td>
            <td class="num">{{ formatPrice(row.amount ?? 0, row.weightGrams ?? 1000) }}</td>
            <td class="num">
              <div class="row-actions">
                <button
                  type="button"
                  class="icon-btn"
                  data-action="edit-price"
                  aria-label="Éditer le prix"
                  @click="openEditPrice(row)"
                >
                  <Pencil :size="13" :stroke-width="1.5" />
                </button>
                <button
                  type="button"
                  class="icon-btn is-danger"
                  data-action="delete-price"
                  aria-label="Supprimer le prix"
                  @click="askDelete(row)"
                >
                  <Trash2 :size="13" :stroke-width="1.5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!prices.length" class="is-empty">
            <td colspan="3" class="muted">Aucun tarif</td>
          </tr>
        </tbody>
      </table>
    </div>

    <UiModal
      :open="movementOpen"
      :title="`Mouvement — ${product?.label ?? ''}`"
      @close="movementOpen = false"
    >
      <ErpStockMovement
        :product="movementProduct"
        @submitted="movementOpen = false"
        @cancel="movementOpen = false"
      />
    </UiModal>

    <UiModal
      :open="editOpen"
      title="Éditer le produit"
      @close="editOpen = false"
    >
      <ErpProductForm
        :product="product ?? undefined"
        @submitted="editOpen = false"
        @cancel="editOpen = false"
      />
    </UiModal>

    <UiModal
      :open="priceFormOpen"
      :title="editingPrice ? 'Éditer le prix' : 'Ajouter un prix'"
      @close="closePriceForm"
    >
      <ErpProductPriceForm
        :product-id="id"
        :price="editingPrice"
        @submitted="closePriceForm"
        @cancel="closePriceForm"
      />
    </UiModal>

    <UiModal
      :open="!!priceToDelete"
      title="Supprimer le prix"
      @close="cancelDelete"
    >
      <div class="modal-form">
        <p>
          Supprimer le tarif
          <strong>{{ priceToDelete?.packaging?.label }}</strong>
          ({{ formatPrice(priceToDelete?.amount ?? 0, priceToDelete?.weightGrams ?? 1000) }}) ?
          Cette action est définitive.
        </p>
        <div v-if="deletePrice.isError.value" class="modal-error" role="alert">
          Impossible de supprimer le prix.
        </div>
        <div class="modal-actions">
          <button type="button" class="btn" data-action="cancel-delete" @click="cancelDelete">
            Annuler
          </button>
          <button
            type="button"
            class="btn btn-danger"
            data-action="confirm-delete"
            :disabled="deletePrice.isPending.value"
            @click="confirmDelete"
          >
            <Trash2 :size="14" :stroke-width="1.5" /> Supprimer
          </button>
        </div>
      </div>
    </UiModal>
  </section>
</template>
