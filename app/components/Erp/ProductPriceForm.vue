<script setup lang="ts">
import { Plus, Save, X } from 'lucide-vue-next'
import type { ProductPrice } from '@tsanta22kyle/erp-client'
import { useUpsertProductPrice } from '~/composables/useProducts'
import { usePackaging, useUpsertPackaging } from '~/composables/usePackaging'
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
const packagingMutation = useUpsertPackaging()

// Montant en Ariary (entier, sans subdivision) — stocké tel quel par l'API.
const amount = ref<number>(props.price?.amount ?? 0)
const weightGrams = ref<number>(props.price?.weightGrams ?? 1000)
const packagingId = ref<string>(props.price?.packaging?.id ?? '')

// Mode création inline d'un conditionnement.
const packagingMode = ref<'select' | 'create'>('select')
const newPackagingLabel = ref<string>('')

watch(packagings, (list) => {
  if (!packagingId.value && list.length > 0) {
    packagingId.value = list[0]!.id ?? ''
  }
}, { immediate: true })

const canSubmit = computed(
  () => amount.value > 0
    && weightGrams.value > 0
    && packagingMode.value === 'select'
    && !mutation.isPending.value,
)

const canSavePackaging = computed(
  () => newPackagingLabel.value.trim().length > 0 && !packagingMutation.isPending.value,
)

function openPackagingCreate() {
  newPackagingLabel.value = ''
  packagingMode.value = 'create'
}

function cancelPackagingCreate() {
  packagingMode.value = 'select'
  newPackagingLabel.value = ''
}

function savePackaging() {
  if (!canSavePackaging.value) return
  const id = generateUUID()
  packagingMutation.mutate(
    { id, payload: { label: newPackagingLabel.value.trim(), isActive: true } },
    {
      onSuccess: () => {
        packagingId.value = id
        packagingMode.value = 'select'
        newPackagingLabel.value = ''
      },
    },
  )
}

function onSubmit() {
  if (!canSubmit.value) return
  const id = props.price?.id ?? generateUUID()
  mutation.mutate(
    {
      id,
      payload: {
        productId: props.productId,
        packagingId: packagingId.value || null,
        amount: Math.round(amount.value),
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
    <div class="field" data-field="packaging">
      <span class="field-label">Conditionnement</span>

      <div v-if="packagingMode === 'select'" class="packaging-row">
        <select v-model="packagingId" name="packaging">
          <option v-for="p in packagings" :key="p.id" :value="p.id">{{ p.label }}</option>
        </select>
        <button
          type="button"
          class="btn btn-sm"
          data-action="new-packaging"
          @click="openPackagingCreate"
        >
          <Plus :size="12" :stroke-width="1.5" /> Nouveau
        </button>
      </div>

      <div v-else class="packaging-row">
        <input
          v-model="newPackagingLabel"
          name="new-packaging-label"
          type="text"
          placeholder="Libellé (ex. Export, Pro, Détail…)"
          autofocus
          @keydown.enter.prevent="savePackaging"
        >
        <button
          type="button"
          class="btn btn-sm btn-primary"
          data-action="save-packaging"
          :disabled="!canSavePackaging"
          @click="savePackaging"
        >
          <Save :size="12" :stroke-width="1.5" />
        </button>
        <button
          type="button"
          class="btn btn-sm"
          data-action="cancel-packaging"
          @click="cancelPackagingCreate"
        >
          <X :size="12" :stroke-width="1.5" />
        </button>
      </div>

      <span v-if="packagingMutation.isError.value" class="modal-error" role="alert">
        Impossible d'enregistrer le conditionnement.
      </span>
    </div>

    <div class="field-row">
      <label class="field" data-field="amount">
        <span class="field-label">Prix (Ar)</span>
        <input
          v-model.number="amount"
          name="amount"
          type="number"
          min="0"
          step="1"
          inputmode="numeric"
          placeholder="0"
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
