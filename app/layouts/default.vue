<script setup lang="ts">
const activeSection = ref('dashboard')

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeSection.value = id
}

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]) activeSection.value = visible[0].target.id
    },
    { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
  )

  const sections = ['dashboard', 'catalog', 'product', 'stock']
  sections.forEach(id => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  return () => observer.disconnect()
})
</script>

<template>
  <div class="app">
    <ErpSidebar :active="activeSection" @navigate="scrollTo" />
    <main class="main">
      <ErpTopbar :active="activeSection" />
      <slot />
    </main>
  </div>
</template>
