<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{ open: boolean; title: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div
    v-if="open"
    class="modal-backdrop"
    role="presentation"
    @click.self="emit('close')"
  >
    <div class="modal" role="dialog" aria-modal="true">
      <header class="modal-head">
        <div class="modal-title">{{ title }}</div>
        <button
          type="button"
          class="modal-close"
          aria-label="Fermer"
          @click="emit('close')"
        >
          <X :size="16" :stroke-width="1.5" />
        </button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
    </div>
  </div>
</template>
