<script setup lang="ts">
import { Plus, Save } from 'lucide-vue-next'
import { useCreateSale, type SaleLine } from '~/composables/useSales'
import { generateUUID } from '~/utils/uuid'

const emit = defineEmits<{ submitted: [id: string]; cancel: [] }>()

const mutation = useCreateSale()

function emptyLine(): SaleLine {
  return { productId: '', productPriceId: '', quantity: 1 }
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

const saleDate = ref<string>(today())
const description = ref<string>('')
const lines = ref<SaleLine[]>([emptyLine()])

function addLine() {
  lines.value.push(emptyLine())
}

function removeLine(index: number) {
  if (lines.value.length > 1) lines.value.splice(index, 1)
}

function updateLine(index: number, value: SaleLine) {
  lines.value[index] = value
}

const lineIsComplete = (l: SaleLine) =>
  !!l.productId && !!l.productPriceId && l.quantity > 0

const canSubmit = computed(
  () => lines.value.every(lineIsComplete) && !mutation.isPending.value,
)

function onSubmit() {
  if (!canSubmit.value) return
  const id = generateUUID()
  mutation.mutate(
    {
      id,
      payload: {
        saleDate: new Date(saleDate.value),
        description: description.value.trim() || null,
        items: lines.value.map(l => ({
          productId: l.productId,
          productPriceId: l.productPriceId,
          quantity: l.quantity,
        })),
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
    <div class="field-row">
      <label class="field" data-field="saleDate">
        <span class="field-label">Date</span>
        <input v-model="saleDate" name="saleDate" type="date">
      </label>

      <label class="field" data-field="description">
        <span class="field-label">Description</span>
        <input v-model="description" name="description" type="text" placeholder="Note (optionnel)">
      </label>
    </div>

    <div class="sale-lines">
      <span class="field-label">Lignes du ticket</span>
      <ErpSaleLineItem
        v-for="(line, i) in lines"
        :key="i"
        :model-value="line"
        :removable="lines.length > 1"
        @update:model-value="updateLine(i, $event)"
        @remove="removeLine(i)"
      />
      <button type="button" class="btn btn-ghost" data-action="add-line" @click="addLine">
        <Plus :size="14" :stroke-width="1.5" /> Ajouter une ligne
      </button>
    </div>

    <div v-if="mutation.isError.value" class="modal-error" role="alert">
      Impossible d'enregistrer le ticket.
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
