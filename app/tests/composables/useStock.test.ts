import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { useStockMovements, useCreateStockMovement } from '~/composables/useStock'
import { generateUUID } from '~/utils/uuid'

const MovementsComp = defineComponent({
  setup() {
    const { data, isPending, isError } = useStockMovements()
    return { data, isPending, isError }
  },
  template: `
    <div>
      <span class="count">{{ data?.data?.length ?? 0 }}</span>
      <span class="total">{{ data?.meta?.total ?? 0 }}</span>
      <span class="first-type">{{ data?.data?.[0]?.type ?? '' }}</span>
    </div>
  `,
})

const CreateComp = defineComponent({
  setup() {
    const mut = useCreateStockMovement()
    return {
      isPending: mut.isPending,
      isSuccess: mut.isSuccess,
      isError: mut.isError,
      data: mut.data,
      mutate: mut.mutate,
    }
  },
  template: `
    <div>
      <span class="status">{{ isPending ? 'pending' : isSuccess ? 'success' : 'idle' }}</span>
      <span class="movement-id">{{ data?.id ?? '' }}</span>
      <button @click="mutate({ id: 'new-uuid-1', payload: { type: 'entry', productId: 'prod-001', quantity: 4, weightGrams: 3200 } })">go</button>
    </div>
  `,
})

describe('useStockMovements', () => {
  it('retourne la liste des mouvements avec meta', async () => {
    const w = await mountSuspended(MovementsComp)
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.count').text()).toBe('2')
    expect(w.find('.total').text()).toBe('2')
  })

  it('expose le type du premier mouvement', async () => {
    const w = await mountSuspended(MovementsComp)
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.first-type').text()).toBe('entry')
  })
})

describe('useCreateStockMovement', () => {
  it('démarre à l\'état idle', async () => {
    const w = await mountSuspended(CreateComp)
    expect(w.find('.status').text()).toBe('idle')
    expect(w.find('.movement-id').text()).toBe('')
  })

  it('exécute la mutation et expose l\'id du mouvement créé', async () => {
    const w = await mountSuspended(CreateComp)
    await w.find('button').trigger('click')
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.status').text()).toBe('success')
    expect(w.find('.movement-id').text()).toBe('new-uuid-1')
  })

  it('génère un id unique via generateUUID pour chaque appel', () => {
    const id1 = generateUUID()
    const id2 = generateUUID()
    expect(id1).not.toBe(id2)
    expect(id1).toMatch(/^[0-9a-f-]{36}$/)
  })
})
