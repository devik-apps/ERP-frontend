import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { useSuppliers, useUpsertSupplier } from '~/composables/useSuppliers'

const ListComp = defineComponent({
  setup() {
    const { data, isPending } = useSuppliers()
    return { data, isPending }
  },
  template: `<div><span class="count">{{ data?.data?.length ?? 0 }}</span></div>`,
})

describe('useSuppliers', () => {
  it('expose les fournisseurs renvoyés par /suppliers', async () => {
    const w = await mountSuspended(ListComp)
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.count').text()).toBe('10')
  })
})

const UpsertComp = defineComponent({
  setup() {
    const mut = useUpsertSupplier()
    return {
      isPending: mut.isPending,
      isSuccess: mut.isSuccess,
      data: mut.data,
      mutate: mut.mutate,
    }
  },
  template: `
    <div>
      <span class="status">{{ isPending ? 'pending' : isSuccess ? 'success' : 'idle' }}</span>
      <span class="supplier-id">{{ data?.id ?? '' }}</span>
      <button @click="mutate({ id: 'sup-new-1', payload: { name: 'Nouveau mareyeur', contact: 'Jean', isActive: true } })">go</button>
    </div>
  `,
})

describe('useUpsertSupplier', () => {
  it('démarre à l\'état idle', async () => {
    const w = await mountSuspended(UpsertComp)
    expect(w.find('.status').text()).toBe('idle')
  })

  it('exécute la mutation et retourne le fournisseur créé', async () => {
    const w = await mountSuspended(UpsertComp)
    await w.find('button').trigger('click')
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.status').text()).toBe('success')
    expect(w.find('.supplier-id').text()).toBe('sup-new-1')
  })
})
