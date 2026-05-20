import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UiModal from '~/components/Ui/Modal.vue'

describe('UiModal', () => {
  it('ne rend rien quand open est false', async () => {
    const w = await mountSuspended(UiModal, { props: { open: false, title: 'Titre' } })
    expect(w.find('.modal-backdrop').exists()).toBe(false)
  })

  it('rend le backdrop et le panneau quand open est true', async () => {
    const w = await mountSuspended(UiModal, { props: { open: true, title: 'Titre' } })
    expect(w.find('.modal-backdrop').exists()).toBe(true)
    expect(w.find('.modal').exists()).toBe(true)
  })

  it('affiche le titre fourni', async () => {
    const w = await mountSuspended(UiModal, { props: { open: true, title: 'Nouveau produit' } })
    expect(w.find('.modal-title').text()).toBe('Nouveau produit')
  })

  it('rend le contenu du slot', async () => {
    const w = await mountSuspended(UiModal, {
      props: { open: true, title: 'T' },
      slots: { default: () => h('p', { class: 'slot-content' }, 'Corps') },
    })
    expect(w.find('.slot-content').text()).toBe('Corps')
  })

  it('émet close au clic sur le backdrop', async () => {
    const w = await mountSuspended(UiModal, { props: { open: true, title: 'T' } })
    await w.find('.modal-backdrop').trigger('click')
    expect(w.emitted('close')).toBeTruthy()
  })

  it('émet close au clic sur le bouton de fermeture', async () => {
    const w = await mountSuspended(UiModal, { props: { open: true, title: 'T' } })
    await w.find('.modal-close').trigger('click')
    expect(w.emitted('close')).toBeTruthy()
  })

  it("n'émet pas close au clic à l'intérieur du panneau", async () => {
    const w = await mountSuspended(UiModal, { props: { open: true, title: 'T' } })
    await w.find('.modal').trigger('click')
    expect(w.emitted('close')).toBeFalsy()
  })
})
