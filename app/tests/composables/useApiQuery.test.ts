import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { useApiQuery } from '~/composables/useApiQuery'

const CategoriesComp = defineComponent({
  setup() {
    const query = useApiQuery(
      () => ['categories'],
      (api) => api.GET('/categories', {}),
    )
    return {
      isPending: query.isPending,
      isError: query.isError,
      count: ref(0),
      data: query.data,
    }
  },
  template: `
    <div>
      <span class="state">{{ isPending ? 'loading' : isError ? 'error' : 'ok' }}</span>
      <span class="count">{{ data?.data?.length ?? 0 }}</span>
    </div>
  `,
})

describe('useApiQuery', () => {
  it('monte sans erreur et expose les propriétés réactives', async () => {
    const wrapper = await mountSuspended(CategoriesComp)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.state').exists()).toBe(true)
    expect(wrapper.find('.count').exists()).toBe(true)
  })

  it('récupère les données via MSW et les expose dans data', async () => {
    const wrapper = await mountSuspended(CategoriesComp)
    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.count').text()).toBe('2')
    expect(wrapper.find('.state').text()).toBe('ok')
  })
})
