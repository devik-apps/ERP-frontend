import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ErpStockMovement from '~/components/Erp/StockMovement.vue'

describe('ErpStockMovement — entête', () => {
  it('affiche eyebrow, titre et sous-titre', async () => {
    const w = await mountSuspended(ErpStockMovement)
    expect(w.find('.eyebrow').text()).toBe('Stock')
    expect(w.find('.sec-title').text()).toBe('Nouveau mouvement')
    expect(w.find('.sec-sub').exists()).toBe(true)
  })

  it('a l\'id stock pour le scroll-spy', async () => {
    const w = await mountSuspended(ErpStockMovement)
    expect(w.find('#stock').exists()).toBe(true)
  })

  it('expose une action principale Enregistrer le mouvement', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const submit = w.find('button[type="submit"]')
    expect(submit.exists()).toBe(true)
    expect(submit.text()).toContain('Enregistrer')
  })
})

describe('ErpStockMovement — segments de type', () => {
  it('expose deux segments Entrée et Sortie, Entrée actif par défaut', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const segs = w.findAll('[data-field="type"] .seg-item')
    expect(segs).toHaveLength(2)
    expect(segs[0]!.text()).toBe('Entrée')
    expect(segs[1]!.text()).toBe('Sortie')
    expect(segs[0]!.classes()).toContain('is-active')
  })

  it('change le segment actif au clic sur Sortie', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const segs = w.findAll('[data-field="type"] .seg-item')
    await segs[1]!.trigger('click')
    expect(segs[1]!.classes()).toContain('is-active')
    expect(segs[0]!.classes()).not.toContain('is-active')
  })
})

describe('ErpStockMovement — champs du formulaire', () => {
  it('expose un sélecteur de produit avec les 15 références', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const select = w.find('select[name="product"]')
    expect(select.exists()).toBe(true)
    const options = select.findAll('option')
    expect(options.length).toBe(15)
  })

  it('expose un champ quantité numérique', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const input = w.find('input[name="qty"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('number')
  })

  it('expose un champ poids unitaire en grammes', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const input = w.find('input[name="unitWeight"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('number')
  })

  it('expose un champ origine pour Entrée', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const label = w.find('[data-field="origin"] .field-label')
    expect(label.text()).toBe('Origine')
    expect(w.find('input[name="origin"]').exists()).toBe(true)
  })

  it('renomme origine en destination quand Sortie est sélectionné', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const segs = w.findAll('[data-field="type"] .seg-item')
    await segs[1]!.trigger('click')
    const label = w.find('[data-field="origin"] .field-label')
    expect(label.text()).toBe('Destination')
  })

  it('expose un sélecteur d\'opérateur', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const select = w.find('select[name="operator"]')
    expect(select.exists()).toBe(true)
    const options = select.findAll('option').map(o => o.text())
    expect(options).toContain('Marc')
    expect(options).toContain('Léa')
    expect(options).toContain('Atelier')
  })

  it('expose un champ note', async () => {
    const w = await mountSuspended(ErpStockMovement)
    expect(w.find('textarea[name="note"]').exists()).toBe(true)
  })
})

describe('ErpStockMovement — récapitulatif live', () => {
  it('rend le bloc récapitulatif', async () => {
    const w = await mountSuspended(ErpStockMovement)
    expect(w.find('.movement-summary').exists()).toBe(true)
    expect(w.find('.movement-summary .card-title').text()).toBe('Récapitulatif')
  })

  it('affiche le type courant avec un mv-pill is-in pour Entrée', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const pill = w.find('.movement-summary .mv-pill')
    expect(pill.exists()).toBe(true)
    expect(pill.classes()).toContain('is-in')
    expect(pill.text()).toContain('Entrée')
  })

  it('passe le mv-pill à is-out quand Sortie est sélectionné', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const segs = w.findAll('[data-field="type"] .seg-item')
    await segs[1]!.trigger('click')
    const pill = w.find('.movement-summary .mv-pill')
    expect(pill.classes()).toContain('is-out')
    expect(pill.text()).toContain('Sortie')
  })

  it('affiche le produit sélectionné dans le récap', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const select = w.find('select[name="product"]')
    await select.setValue('Saumon d’Écosse')
    expect(w.find('.movement-summary').text()).toContain('Saumon d’Écosse')
  })

  it('calcule le poids total = quantité × poids unitaire', async () => {
    const w = await mountSuspended(ErpStockMovement)
    await w.find('input[name="qty"]').setValue(4)
    await w.find('input[name="unitWeight"]').setValue(800)
    const total = w.find('[data-summary="total-weight"]')
    expect(total.text()).toContain('3 200')
    expect(total.text()).toContain('g')
  })

  it('calcule le stock après mouvement pour une Entrée', async () => {
    const w = await mountSuspended(ErpStockMovement)
    await w.find('input[name="qty"]').setValue(4)
    await w.find('input[name="unitWeight"]').setValue(800)
    const after = w.find('[data-summary="stock-after"]')
    expect(after.text()).toContain('35,6')
    expect(after.text()).toContain('kg')
  })

  it('calcule le stock après mouvement pour une Sortie', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const segs = w.findAll('[data-field="type"] .seg-item')
    await segs[1]!.trigger('click')
    await w.find('input[name="qty"]').setValue(2)
    await w.find('input[name="unitWeight"]').setValue(1000)
    const after = w.find('[data-summary="stock-after"]')
    expect(after.text()).toContain('30,4')
  })

  it('signale un stock insuffisant quand une sortie dépasse le stock', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const segs = w.findAll('[data-field="type"] .seg-item')
    await segs[1]!.trigger('click')
    await w.find('input[name="qty"]').setValue(100)
    await w.find('input[name="unitWeight"]').setValue(1000)
    expect(w.find('.movement-warning').exists()).toBe(true)
    expect(w.find('.movement-warning').text()).toContain('insuffisant')
  })
})

describe('ErpStockMovement — validation et soumission', () => {
  it('désactive le bouton tant que quantité ou poids est nul', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const submit = w.find('button[type="submit"]')
    expect(submit.attributes('disabled')).toBeDefined()
  })

  it('active le bouton quand quantité et poids sont renseignés', async () => {
    const w = await mountSuspended(ErpStockMovement)
    await w.find('input[name="qty"]').setValue(2)
    await w.find('input[name="unitWeight"]').setValue(500)
    const submit = w.find('button[type="submit"]')
    expect(submit.attributes('disabled')).toBeUndefined()
  })

  it('désactive le bouton si la sortie dépasse le stock', async () => {
    const w = await mountSuspended(ErpStockMovement)
    const segs = w.findAll('[data-field="type"] .seg-item')
    await segs[1]!.trigger('click')
    await w.find('input[name="qty"]').setValue(100)
    await w.find('input[name="unitWeight"]').setValue(1000)
    const submit = w.find('button[type="submit"]')
    expect(submit.attributes('disabled')).toBeDefined()
  })
})
