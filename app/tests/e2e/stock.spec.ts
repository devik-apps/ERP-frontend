import { test, expect } from '@playwright/test'

test.describe('Stock — vue lecture seule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/stock')
    await page.waitForLoadState('networkidle')
  })

  test('rend la page avec son titre', async ({ page }) => {
    await expect(page.locator('.eyebrow')).toHaveText('Stock')
    await expect(page.locator('.sec-title')).toHaveText('État du stock')
  })

  test("n'expose aucun formulaire ni bouton d'action", async ({ page }) => {
    await expect(page.locator('form')).toHaveCount(0)
    await expect(page.locator('button[type="submit"]')).toHaveCount(0)
    await expect(page.locator('select[name="product"]')).toHaveCount(0)
  })

  test('affiche le tableau Stock par produit', async ({ page }) => {
    await expect(page.locator('[data-table="stock"]')).toBeVisible()
    const headers = page.locator('[data-table="stock"] thead th')
    await expect(headers).toHaveText(['Produit', 'Catégorie', 'Stock', 'Statut'])
  })

  test('affiche le journal des mouvements récents', async ({ page }) => {
    await expect(page.locator('[data-table="movements"]')).toBeVisible()
    await expect(page.locator('[data-table="movements"] .mv-pill').first()).toBeVisible()
  })
})
