import { test, expect } from '@playwright/test'

test.describe('Fiche produit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('rend la section avec son titre', async ({ page }) => {
    await expect(page.locator('#product')).toBeVisible()
    const sec = page.locator('#product')
    await expect(sec.locator('.sec-title')).toHaveText('Thon rouge entier')
    await expect(sec.locator('.eyebrow')).toHaveText('Fiche produit')
  })

  test('affiche le résumé, le bloc stock et le tableau des prix', async ({ page }) => {
    const sec = page.locator('#product')
    await expect(sec.locator('.product-summary')).toBeVisible()
    await expect(sec.locator('.product-stock-card')).toBeVisible()
    await expect(sec.locator('.product-prices table')).toBeVisible()
  })

  test('le bloc stock affiche 4 items', async ({ page }) => {
    await expect(page.locator('.product-stock-card .stock-item')).toHaveCount(4)
  })

  test('le tableau des prix a 4 lignes', async ({ page }) => {
    await expect(page.locator('.product-prices tbody tr')).toHaveCount(4)
  })
})
