import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { usePackaging, useUpsertPackaging } from '~/composables/usePackaging'

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

const UpsertPackagingComp = defineComponent({
  setup() {
    const mut = useUpsertPackaging()
    return {
      isSuccess: mut.isSuccess,
      data: mut.data,
      mutate: mut.mutate,
    }
  },
  template: `
    <div>
      <span class="status">{{ isSuccess ? 'success' : 'idle' }}</span>
      <span class="pkg-id">{{ data?.id ?? '' }}</span>
      <button @click="mutate({ id: 'pkg-new-1', payload: { label: 'Export', isActive: true } })">go</button>
    </div>
  `,
})

describe('useUpsertPackaging', () => {
  it('exécute la mutation et retourne le conditionnement créé', async () => {
    const w = await mountSuspended(UpsertPackagingComp)
    await w.find('button').trigger('click')
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.status').text()).toBe('success')
    expect(w.find('.pkg-id').text()).toBe('pkg-new-1')
  })
})
