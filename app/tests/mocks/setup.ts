import { beforeAll, afterAll, afterEach, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { server } from './server'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const noop = (slotName?: string) =>
  defineComponent({
    name: slotName ?? 'UnovisStub',
    setup(_, { slots }) {
      return () => h('div', { 'data-unovis-stub': slotName }, slots.default?.())
    },
  })

vi.mock('@unovis/vue', () => ({
  VisXYContainer: noop('VisXYContainer'),
  VisLine: noop('VisLine'),
  VisArea: noop('VisArea'),
  VisAxis: noop('VisAxis'),
  VisTooltip: noop('VisTooltip'),
  VisCrosshair: noop('VisCrosshair'),
  VisBulletLegend: noop('VisBulletLegend'),
}))
