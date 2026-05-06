import { test, expect } from '@playwright/test'

test.describe('Mouvement de stock', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/stock')
    await page.waitForLoadState('networkidle')
  })

  test('rend la page avec son titre', async ({ page }) => {
    await expect(page.locator('.eyebrow')).toHaveText('Stock')
    await expect(page.locator('.sec-title')).toHaveText('Nouveau mouvement')
  })

  test('affiche le formulaire avec ses champs', async ({ page }) => {
    await expect(page.locator('select[name="product"]')).toBeVisible()
    await expect(page.locator('input[name="qty"]')).toBeVisible()
    await expect(page.locator('input[name="unitWeight"]')).toBeVisible()
    await expect(page.locator('input[name="origin"]')).toBeVisible()
    await expect(page.locator('select[name="operator"]')).toBeVisible()
    await expect(page.locator('textarea[name="note"]')).toBeVisible()
  })

  test('affiche le récapitulatif live', async ({ page }) => {
    await expect(page.locator('.movement-summary')).toBeVisible()
    await expect(page.locator('.movement-summary .card-title')).toHaveText('Récapitulatif')
  })

  test('met à jour le récapitulatif quand on saisit la quantité et le poids', async ({ page }) => {
    await page.locator('input[name="qty"]').fill('4')
    await page.locator('input[name="unitWeight"]').fill('800')
    await expect(page.locator('[data-summary="total-weight"]')).toContainText('3 200')
  })

  test('bascule entre Entrée et Sortie via les segments', async ({ page }) => {
    const segs = page.locator('[data-field="type"] .seg-btn')
    await segs.nth(1).click()
    await expect(page.locator('.movement-summary .mv-pill.is-out')).toBeVisible()
    await expect(page.locator('[data-field="origin"] .field-label')).toHaveText('Destination')
  })
})
