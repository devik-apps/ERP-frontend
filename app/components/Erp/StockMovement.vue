<script setup lang="ts">
import { ArrowDownToLine, ArrowUpFromLine, Save } from 'lucide-vue-next'
import { useCreateStockMovement } from '~/composables/useStock'
import { generateUUID } from '~/utils/uuid'

type MovementType = 'Entrée' | 'Sortie'

const props = defineProps<{
  product: { id: string; label: string; currentStock?: number }
}>()

const emit = defineEmits<{ submitted: []; cancel: [] }>()

const OPERATORS = ['Marc', 'Léa', 'Atelier'] as const

const mutation = useCreateStockMovement()

const type = ref<MovementType>('Entrée')
const qty = ref<number>(0)
const unitWeight = ref<number>(0)
const origin = ref<string>('')
const operator = ref<(typeof OPERATORS)[number]>('Marc')
const note = ref<string>('')

const segments: { value: MovementType; label: string; icon: typeof ArrowDownToLine }[] = [
  { value: 'Entrée', label: 'Entrée', icon: ArrowDownToLine },
  { value: 'Sortie', label: 'Sortie', icon: ArrowUpFromLine },
]

const currentStock = computed(() => props.product.currentStock ?? 0)

const totalGrams = computed(() => Math.max(0, qty.value) * Math.max(0, unitWeight.value))
const totalKg = computed(() => totalGrams.value / 1000)

const stockAfter = computed(() => {
  const delta = type.value === 'Entrée' ? totalKg.value : -totalKg.value
  return currentStock.value + delta
})

const insufficient = computed(
  () => type.value === 'Sortie' && totalKg.value > currentStock.value,
)

const canSubmit = computed(
  () => qty.value > 0 && unitWeight.value > 0 && !insufficient.value && !mutation.isPending.value,
)

function fmtG(n: number): string {
  return Math.round(n).toLocaleString('fr-FR').replace(/\p{Zs}/gu, ' ')
}

function fmtKg(n: number): string {
  return n.toLocaleString('fr-FR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

const originLabel = computed(() => (type.value === 'Entrée' ? 'Origine' : 'Destination'))
const originPlaceholder = computed(
  () => (type.value === 'Entrée' ? 'Mareyeur, fournisseur, atelier…' : 'Comptoir, livraison, atelier…'),
)

function onSubmit() {
  if (!canSubmit.value) return
  const uuid = generateUUID()
  const description = note.value ? `[${operator.value}] ${note.value}` : `[${operator.value}]`
  mutation.mutate(
    {
      id: uuid,
      payload: {
        type: type.value === 'Entrée' ? 'entry' : 'exit',
        productId: props.product.id,
        quantity: qty.value,
        weightGrams: totalGrams.value,
        description,
      },
    },
    {
      onSuccess: () => {
        qty.value = 0
        unitWeight.value = 0
        origin.value = ''
        note.value = ''
        type.value = 'Entrée'
        emit('submitted')
      },
    },
  )
}
</script>

<template>
  <form class="modal-form" @submit.prevent="onSubmit">
    <div class="movement-target">
      <span class="mv-pill" :class="type === 'Entrée' ? 'is-in' : 'is-out'">
        <span class="mv-dot" /> {{ type }}
      </span>
      <span class="movement-target-name">{{ product.label }}</span>
    </div>

    <div class="field" data-field="type">
      <span class="field-label">Type de mouvement</span>
      <div class="seg">
        <button
          v-for="s in segments"
          :key="s.value"
          type="button"
          class="seg-btn"
          :class="{ 'is-on': type === s.value }"
          @click="type = s.value"
        >
          <component :is="s.icon" :size="13" :stroke-width="1.5" />
          {{ s.label }}
        </button>
      </div>
    </div>

    <div class="field-row">
      <label class="field" data-field="qty">
        <span class="field-label">Quantité</span>
        <input v-model.number="qty" name="qty" type="number" min="0" step="1" placeholder="0">
      </label>

      <label class="field" data-field="unitWeight">
        <span class="field-label">Poids unitaire (g)</span>
        <input v-model.number="unitWeight" name="unitWeight" type="number" min="0" step="50" placeholder="0">
      </label>
    </div>

    <div class="field-row">
      <label class="field" data-field="origin">
        <span class="field-label">{{ originLabel }}</span>
        <input v-model="origin" name="origin" type="text" :placeholder="originPlaceholder">
      </label>

      <label class="field" data-field="operator">
        <span class="field-label">Opérateur</span>
        <select v-model="operator" name="operator">
          <option v-for="o in OPERATORS" :key="o" :value="o">{{ o }}</option>
        </select>
      </label>
    </div>

    <label class="field" data-field="note">
      <span class="field-label">Note</span>
      <textarea v-model="note" name="note" rows="2" placeholder="Détail de l'opération (optionnel)" />
    </label>

    <dl class="movement-recap">
      <div>
        <dt>Poids total</dt>
        <dd data-summary="total-weight">{{ fmtG(totalGrams) }} g</dd>
      </div>
      <div>
        <dt>Stock actuel</dt>
        <dd>{{ fmtKg(currentStock) }} kg</dd>
      </div>
      <div>
        <dt>Stock après mouvement</dt>
        <dd data-summary="stock-after" class="strong">{{ fmtKg(stockAfter) }} kg</dd>
      </div>
    </dl>

    <div v-if="insufficient" class="movement-warning">
      Stock insuffisant pour cette sortie.
    </div>

    <div class="modal-actions">
      <button type="button" class="btn" data-action="cancel" @click="emit('cancel')">
        Annuler
      </button>
      <button type="submit" class="btn btn-primary" :disabled="!canSubmit">
        <Save :size="14" :stroke-width="1.5" /> Enregistrer le mouvement
      </button>
    </div>
  </form>
</template>
