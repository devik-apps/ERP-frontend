<script setup lang="ts">
import { Save } from 'lucide-vue-next'
import type { ProductPrice } from '@tsanta22kyle/erp-client'
import { useUpsertProductPrice } from '~/composables/useProducts'
import { usePackaging } from '~/composables/usePackaging'
import { generateUUID } from '~/utils/uuid'

const props = defineProps<{
  productId: string
  price?: ProductPrice
}>()

const emit = defineEmits<{ submitted: [id: string]; cancel: [] }>()

const packagingQ = usePackaging()
const { data: packagingData } = packagingQ
const packagings = computed(() => packagingData.value?.data ?? [])

const mutation = useUpsertProductPrice()

// Saisie utilisateur en euros (UI) — l'API stocke les montants en centimes.
const amountEuros = ref<number>(props.price?.amount != null ? props.price.amount / 100 : 0)
const weightGrams = ref<number>(props.price?.weightGrams ?? 1000)
const packagingId = ref<string>(props.price?.packaging?.id ?? '')

watch(packagings, (list) => {
  if (!packagingId.value && list.length > 0) {
    packagingId.value = list[0]!.id ?? ''
  }
}, { immediate: true })

const canSubmit = computed(
  () => amountEuros.value > 0 && weightGrams.value > 0 && !mutation.isPending.value,
)

function onSubmit() {
  if (!canSubmit.value) return
  const id = props.price?.id ?? generateUUID()
  const amountCents = Math.round(amountEuros.value * 100)
  mutation.mutate(
    {
      id,
      payload: {
        productId: props.productId,
        packagingId: packagingId.value || null,
        amount: amountCents,
        weightGrams: weightGrams.value,
        validFrom: new Date(),
      },
    },
    {
      onSuccess: () => emit('submitted', id),
    },
  )
}
</script>

<template>
  <form class="modal-form" @submit.prevent="onSubmit">
    <label class="field" data-field="packaging">
      <span class="field-label">Conditionnement</span>
      <select v-model="packagingId" name="packaging">
        <option v-for="p in packagings" :key="p.id" :value="p.id">{{ p.label }}</option>
      </select>
    </label>

    <div class="field-row">
      <label class="field" data-field="amount">
        <span class="field-label">Prix (€)</span>
        <input
          v-model.number="amountEuros"
          name="amount"
          type="number"
          min="0"
          step="0.01"
          inputmode="decimal"
          placeholder="0,00"
        >
      </label>

      <label class="field" data-field="weightGrams">
        <span class="field-label">Poids (g)</span>
        <input
          v-model.number="weightGrams"
          name="weightGrams"
          type="number"
          min="0"
          step="50"
          placeholder="1000"
        >
      </label>
    </div>

    <div v-if="mutation.isError.value" class="modal-error" role="alert">
      Impossible d'enregistrer le prix.
    </div>

    <div class="modal-actions">
      <button type="button" class="btn" data-action="cancel" @click="emit('cancel')">
        Annuler
      </button>
      <button type="submit" class="btn btn-primary" :disabled="!canSubmit">
        <Save :size="14" :stroke-width="1.5" /> Enregistrer
      </button>
    </div>
  </form>
</template>
