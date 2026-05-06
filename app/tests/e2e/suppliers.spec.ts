import { test, expect } from '@playwright/test'

test.describe('Fournisseurs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/suppliers')
    await page.waitForLoadState('networkidle')
  })

  test('rend la page avec son titre', async ({ page }) => {
    await expect(page.locator('.eyebrow')).toHaveText('Fournisseurs')
    await expect(page.locator('.sec-title')).toHaveText('Annuaire')
  })

  test('rend 4 cartes de métriques', async ({ page }) => {
    await expect(page.locator('.metric')).toHaveCount(4)
  })

  test('affiche 10 fournisseurs', async ({ page }) => {
    await expect(page.locator('.tbl tbody tr')).toHaveCount(10)
  })

  test('le filtre Actif réduit le tableau à 8 lignes', async ({ page }) => {
    await page.locator('[data-filter="status"]').getByRole('button', { name: 'Actif', exact: true }).click()
    await expect(page.locator('.tbl tbody tr')).toHaveCount(8)
  })

  test('le filtre Inactif réduit le tableau à 1 ligne', async ({ page }) => {
    await page.locator('[data-filter="status"]').getByRole('button', { name: 'Inactif' }).click()
    await expect(page.locator('.tbl tbody tr')).toHaveCount(1)
  })

  test('le filtre Coquillages réduit le tableau à 3 lignes', async ({ page }) => {
    await page.locator('[data-filter="category"]').getByRole('button', { name: 'Coquillages' }).click()
    await expect(page.locator('.tbl tbody tr')).toHaveCount(3)
  })

  test('la sidebar expose un lien Fournisseurs actif', async ({ page }) => {
    await expect(page.locator('.sb').getByRole('link', { name: 'Fournisseurs' })).toBeVisible()
  })
})
