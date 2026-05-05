import { test, expect } from '@playwright/test'

test.describe('Catalogue produits', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('rend la section avec son titre', async ({ page }) => {
    await expect(page.locator('#catalog')).toBeVisible()
    const sec = page.locator('#catalog')
    await expect(sec.locator('.sec-title')).toHaveText('Catalogue')
  })

  test('rend 15 product cards', async ({ page }) => {
    await expect(page.locator('.product-card')).toHaveCount(15)
  })

  test('la recherche réduit la grille', async ({ page }) => {
    await page.getByPlaceholder(/rechercher/i).fill('saumon')
    await expect(page.locator('.product-card')).toHaveCount(3)
  })

  test('le filtre catégorie Coquillages réduit à 3 cards', async ({ page }) => {
    await page.locator('[data-filter="category"]').getByRole('button', { name: 'Coquillages' }).click()
    await expect(page.locator('.product-card')).toHaveCount(3)
  })

  test('le filtre statut Stock bas réduit à 1 card', async ({ page }) => {
    await page.locator('[data-filter="status"]').getByRole('button', { name: 'Stock bas' }).click()
    await expect(page.locator('.product-card')).toHaveCount(1)
  })
})
