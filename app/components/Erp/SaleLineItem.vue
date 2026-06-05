<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { useProducts, useProductPrices } from '~/composables/useProducts'
import type { SaleLine } from '~/composables/useSales'

const props = defineProps<{ modelValue: SaleLine; removable: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [value: SaleLine]
  remove: []
}>()

const productsQ = useProducts()
const products = computed(() => productsQ.data.value?.data ?? [])

const pricesQ = useProductPrices(() => props.modelValue.productId)
const prices = computed(() => (props.modelValue.productId ? pricesQ.data.value?.data ?? [] : []))

function patch(part: Partial<SaleLine>) {
  emit('update:modelValue', { ...props.modelValue, ...part })
}

function onProduct(e: Event) {
  // Changer de produit invalide le tarif sélectionné.
  patch({ productId: (e.target as HTMLSelectElement).value, productPriceId: '' })
}

function priceLabel(p: { packaging?: { label?: string }; amount?: number }): string {
  const label = p.packaging?.label ?? 'Tarif'
  const amount = (p.amount ?? 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })
  return `${label} — ${amount} Ar`
}
</script>

<template>
  <div class="sale-line" data-line>
    <label class="field" data-field="product">
      <span class="field-label">Produit</span>
      <select :value="modelValue.productId" name="product" @change="onProduct">
        <option value="" disabled>Choisir…</option>
        <option v-for="p in products" :key="p.id" :value="p.id">{{ p.label }}</option>
      </select>
    </label>

    <label class="field" data-field="price">
      <span class="field-label">Tarif</span>
      <select
        :value="modelValue.productPriceId"
        name="price"
        :disabled="!modelValue.productId"
        @change="patch({ productPriceId: ($event.target as HTMLSelectElement).value })"
      >
        <option value="" disabled>Choisir…</option>
        <option v-for="pr in prices" :key="pr.id" :value="pr.id">{{ priceLabel(pr) }}</option>
      </select>
    </label>

    <label class="field" data-field="quantity">
      <span class="field-label">Quantité</span>
      <input
        :value="modelValue.quantity"
        name="quantity"
        type="number"
        min="1"
        step="1"
        @input="patch({ quantity: Number(($event.target as HTMLInputElement).value) })"
      >
    </label>

    <button
      type="button"
      class="icon-btn is-danger"
      data-action="remove-line"
      :disabled="!removable"
      aria-label="Retirer la ligne"
      @click="emit('remove')"
    >
      <Trash2 :size="14" :stroke-width="1.5" />
    </button>
  </div>
</template>
