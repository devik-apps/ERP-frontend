import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { flushPromises } from '@vue/test-utils'
import {
  useCategories,
  useProducts,
  useProduct,
  useProductStock,
  useProductPrices,
  productStatus,
} from '~/composables/useProducts'

const CategoriesComp = defineComponent({
  setup() {
    const { data, isPending, isError } = useCategories()
    return { data, isPending, isError }
  },
  template: `
    <div>
      <span class="count">{{ data?.data?.length ?? 0 }}</span>
      <span class="total">{{ data?.meta?.total ?? 0 }}</span>
    </div>
  `,
})

const ProductsComp = defineComponent({
  setup() {
    const { data, isPending, isError } = useProducts()
    return { data, isPending, isError }
  },
  template: `
    <div>
      <span class="count">{{ data?.data?.length ?? 0 }}</span>
      <span class="total">{{ data?.meta?.total ?? 0 }}</span>
    </div>
  `,
})

const ProductComp = defineComponent({
  props: { id: { type: String, required: true } },
  setup(props) {
    const { data } = useProduct(() => props.id)
    return { data }
  },
  template: `<div><span class="label">{{ data?.label ?? '' }}</span></div>`,
})

const StockComp = defineComponent({
  props: { id: { type: String, required: true } },
  setup(props) {
    const { data } = useProductStock(() => props.id)
    return { data }
  },
  template: `<div><span class="qty">{{ data?.totalQuantity ?? 0 }}</span></div>`,
})

const PricesComp = defineComponent({
  props: { id: { type: String, required: true } },
  setup(props) {
    const { data } = useProductPrices(() => props.id)
    return { data }
  },
  template: `<div><span class="count">{{ data?.data?.length ?? 0 }}</span></div>`,
})

describe('useCategories', () => {
  it('retourne 5 catégories avec meta', async () => {
    const w = await mountSuspended(CategoriesComp)
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.count').text()).toBe('5')
    expect(w.find('.total').text()).toBe('5')
  })
})

describe('useProducts', () => {
  it('retourne 15 produits avec meta total', async () => {
    const w = await mountSuspended(ProductsComp)
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.count').text()).toBe('15')
    expect(w.find('.total').text()).toBe('15')
  })
})

describe('useProduct', () => {
  it('retourne le détail d\'un produit par id', async () => {
    const w = await mountSuspended(ProductComp, { props: { id: 'prod-001' } })
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.label').text()).toBe('Thon rouge entier')
  })
})

describe('useProductStock', () => {
  it('retourne le stock du produit', async () => {
    const w = await mountSuspended(StockComp, { props: { id: 'prod-001' } })
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.qty').text()).toBe('32.4')
  })
})

describe('useProductPrices', () => {
  it('retourne 4 prix actifs', async () => {
    const w = await mountSuspended(PricesComp, { props: { id: 'prod-001' } })
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.find('.count').text()).toBe('4')
  })
})

describe('productStatus', () => {
  it('retourne Inactif si isActive = false', () => {
    expect(productStatus({ isActive: false, currentStock: 10 })).toBe('Inactif')
  })

  it('retourne Stock bas si stock sous le seuil', () => {
    expect(productStatus({ isActive: true, currentStock: 1.2 })).toBe('Stock bas')
  })

  it('retourne Actif si stock au-dessus du seuil', () => {
    expect(productStatus({ isActive: true, currentStock: 5 })).toBe('Actif')
  })
})
