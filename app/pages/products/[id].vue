<script setup lang="ts">
const route = useRoute()
const id = computed(() => String(route.params.id))
useHead({ title: 'Fiche produit — Poissonnerie du Vieux Port' })
</script>

<template>
  <ErpProductDetail :id="id" />
</template>
