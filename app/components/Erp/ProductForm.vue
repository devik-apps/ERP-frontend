<script setup lang="ts">
import { Save } from 'lucide-vue-next'
import { useCategories, useUpsertProduct } from '~/composables/useProducts'
import { generateUUID } from '~/utils/uuid'

type ProductInput = {
  id?: string
  label?: string
  description?: string | null
  category?: { id?: string; label?: string }
  isActive?: boolean
}

const props = defineProps<{ product?: ProductInput }>()
const emit = defineEmits<{ submitted: [id: string]; cancel: [] }>()

const categoriesQ = useCategories()
const { data: categoriesData } = categoriesQ
const categories = computed(() => categoriesData.value?.data ?? [])

const mutation = useUpsertProduct()

const label = ref<string>(props.product?.label ?? '')
const description = ref<string>(props.product?.description ?? '')
const categoryId = ref<string>(props.product?.category?.id ?? '')
const isActive = ref<boolean>(props.product?.isActive ?? true)

watch(categories, (list) => {
  if (!categoryId.value && list.length > 0) {
    categoryId.value = list[0]!.id ?? ''
  }
}, { immediate: true })

const canSubmit = computed(
  () => label.value.trim().length > 0 && !!categoryId.value && !mutation.isPending.value,
)

function onSubmit() {
  if (!canSubmit.value) return
  const id = props.product?.id ?? generateUUID()
  mutation.mutate(
    {
      id,
      payload: {
        label: label.value.trim(),
        description: description.value.trim() || null,
        categoryId: categoryId.value,
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
    <label class="field" data-field="label">
      <span class="field-label">Libellé</span>
      <input v-model="label" name="label" type="text" placeholder="Nom du produit" autofocus>
    </label>

    <label class="field" data-field="description">
      <span class="field-label">Description</span>
      <textarea v-model="description" name="description" rows="3" placeholder="Détails, calibre, provenance…" />
    </label>

    <div class="field-row">
      <label class="field" data-field="category">
        <span class="field-label">Catégorie</span>
        <select v-model="categoryId" name="category">
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.label }}</option>
        </select>
      </label>

      <label class="field field-check" data-field="isActive">
        <span class="field-label">Statut</span>
        <span class="check-row">
          <input v-model="isActive" name="isActive" type="checkbox">
          <span>Actif</span>
        </span>
      </label>
    </div>

    <div v-if="mutation.isError.value" class="modal-error" role="alert">
      Impossible d'enregistrer le produit.
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
