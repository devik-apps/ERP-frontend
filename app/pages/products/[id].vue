<script setup lang="ts">
const route = useRoute()
const id = computed(() => String(route.params.id))
useHead({ title: 'Fiche produit — Fishoo' })
</script>

<template>
  <ErpProductDetail :id="id" />
</template>
