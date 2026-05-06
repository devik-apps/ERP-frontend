import { test, expect } from '@playwright/test'

test.describe('Ventes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sales')
    await page.waitForLoadState('networkidle')
  })

  test('rend la page avec son titre', async ({ page }) => {
    await expect(page.locator('.eyebrow')).toHaveText('Ventes')
    await expect(page.locator('.sec-title')).toHaveText('Activité commerciale')
  })

  test('rend 4 cartes de métriques de ventes', async ({ page }) => {
    await expect(page.locator('.metric')).toHaveCount(4)
  })

  test('affiche les 12 tickets récents', async ({ page }) => {
    await expect(page.locator('.tbl tbody tr')).toHaveCount(12)
  })

  test('le filtre Comptoir réduit le tableau à 6 lignes', async ({ page }) => {
    await page.getByRole('button', { name: 'Comptoir' }).click()
    await expect(page.locator('.tbl tbody tr')).toHaveCount(6)
  })

  test('le filtre Restaurant réduit le tableau à 3 lignes', async ({ page }) => {
    await page.getByRole('button', { name: 'Restaurant' }).click()
    await expect(page.locator('.tbl tbody tr')).toHaveCount(3)
  })

  test('la sidebar expose un lien Ventes actif', async ({ page }) => {
    await expect(page.locator('.sb').getByRole('link', { name: 'Ventes' })).toBeVisible()
  })
})
