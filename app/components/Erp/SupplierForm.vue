<script setup lang="ts">
import { Save } from 'lucide-vue-next'
import { useUpsertSupplier } from '~/composables/useSuppliers'
import { generateUUID } from '~/utils/uuid'

type SupplierInput = {
  id?: string
  name?: string
  contact?: string | null
  description?: string | null
  isActive?: boolean
}

const props = defineProps<{ supplier?: SupplierInput }>()
const emit = defineEmits<{ submitted: [id: string]; cancel: [] }>()

const mutation = useUpsertSupplier()

const name = ref<string>(props.supplier?.name ?? '')
const contact = ref<string>(props.supplier?.contact ?? '')
const description = ref<string>(props.supplier?.description ?? '')
const isActive = ref<boolean>(props.supplier?.isActive ?? true)

const canSubmit = computed(
  () => name.value.trim().length > 0 && !mutation.isPending.value,
)

function onSubmit() {
  if (!canSubmit.value) return
  const id = props.supplier?.id ?? generateUUID()
  mutation.mutate(
    {
      id,
      payload: {
        name: name.value.trim(),
        contact: contact.value.trim() || null,
        description: description.value.trim() || null,
        isActive: isActive.value,
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
    <label class="field" data-field="name">
      <span class="field-label">Nom</span>
      <input v-model="name" name="name" type="text" placeholder="Nom du fournisseur" autofocus>
    </label>

    <label class="field" data-field="contact">
      <span class="field-label">Contact</span>
      <input v-model="contact" name="contact" type="text" placeholder="Personne à contacter">
    </label>

    <label class="field" data-field="description">
      <span class="field-label">Description</span>
      <textarea v-model="description" name="description" rows="3" placeholder="Spécialité, zone, notes…" />
    </label>

    <label class="field field-check" data-field="isActive">
      <span class="field-label">Statut</span>
      <span class="check-row">
        <input v-model="isActive" name="isActive" type="checkbox">
        <span>Actif</span>
      </span>
    </label>

    <div v-if="mutation.isError.value" class="modal-error" role="alert">
      Impossible d'enregistrer le fournisseur.
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
