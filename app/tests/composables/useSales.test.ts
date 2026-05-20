import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useSales, useCreateSale } from '~/composables/useSales'
import { MOCK_SALES } from '../mocks/handlers'

describe('useSales', () => {
  it('retourne 12 ventes depuis GET /sales', async () => {
    const stub = defineComponent({
      setup() { return useSales() },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await flushPromises()
    const data = (w.vm as any).data
    expect(data?.data).toHaveLength(12)
  })

  it('le premier resultat correspond au premier element du mock', async () => {
    const stub = defineComponent({
      setup() { return useSales() },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await flushPromises()
    const first = (w.vm as any).data?.data?.[0]
    expect(first?.id).toBe(MOCK_SALES[0]!.id)
  })
})

describe('useCreateSale', () => {
  it('demarre en etat idle (isPending=false)', async () => {
    const stub = defineComponent({
      setup() { return useCreateSale() },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await flushPromises()
    expect((w.vm as any).isPending).toBe(false)
  })

  it('appelle PUT /sales/{uuid} et expose la vente creee', async () => {
    const stub = defineComponent({
      setup() {
        const m = useCreateSale()
        async function run() {
          await m.mutateAsync({
            id: 'sale-test',
            payload: {
              saleDate: new Date(),
              items: [{ productId: 'prod-001', productPriceId: 'price-1', quantity: 2 }],
            },
          })
        }
        return { ...m, run }
      },
      render: () => h('div'),
    })
    const w = await mountSuspended(stub)
    await (w.vm as any).run()
    await flushPromises()
    expect((w.vm as any).data?.id).toBe('sale-test')
  })

  it('deux appels generent deux UUIDs distincts', async () => {
    const ids = new Set<string>()
    for (let i = 0; i < 2; i++) {
      const stub = defineComponent({
        setup() {
          const m = useCreateSale()
          async function run() {
            const id = crypto.randomUUID()
            ids.add(id)
            await m.mutateAsync({
              id,
              payload: {
                saleDate: new Date(),
                items: [{ productId: 'prod-001', productPriceId: 'price-1', quantity: 1 }],
              },
            })
          }
          return { run }
        },
        render: () => h('div'),
      })
      const w = await mountSuspended(stub)
      await (w.vm as any).run()
      await flushPromises()
    }
    expect(ids.size).toBe(2)
  })
})
