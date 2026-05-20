import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { useApiMutation } from '~/composables/useApiMutation'
import { rawJson } from '~/composables/useApiQuery'
import { generateUUID } from '~/utils/uuid'

interface CategoryPayload { label: string; isActive: boolean }
interface Category { id?: string; label?: string; isActive?: boolean }

const MutationComp = defineComponent({
  setup() {
    const mut = useApiMutation<Category, CategoryPayload>(
      (api, vars) => rawJson(
        api.categories.categoriesIdPutRaw({
          id: generateUUID(),
          categoryPayload: vars,
        }),
      ),
    )
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
      <span class="label">{{ data?.label ?? '' }}</span>
      <button @click="mutate({ label: 'Crustacés', isActive: true })">go</button>
    </div>
  `,
})

describe('useApiMutation', () => {
  it('démarre à l\'état idle', async () => {
    const wrapper = await mountSuspended(MutationComp)
    expect(wrapper.find('.status').text()).toBe('idle')
    expect(wrapper.find('.label').text()).toBe('')
  })

  it('exécute la mutation et expose le résultat dans data', async () => {
    const wrapper = await mountSuspended(MutationComp)
    await wrapper.find('button').trigger('click')
    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.status').text()).toBe('success')
    expect(wrapper.find('.label').text()).toBe('Crustacés')
  })
})
