import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { usePackaging } from '~/composables/usePackaging'

const PackagingComp = defineComponent({
  setup() {
    const { data } = usePackaging()
    return { data }
  },
  template: `<div><span class="count">{{ data?.data?.length ?? 0 }}</span></div>`,
})

describe('usePackaging', () => {
  it('retourne la liste des conditionnements depuis /packaging', async () => {
    const w = await mountSuspended(PackagingComp)
    await flushPromises()
    await w.vm.$nextTick()
    expect(Number(w.find('.count').text())).toBeGreaterThan(0)
  })
})
