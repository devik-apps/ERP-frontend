import { test, expect } from '@playwright/test'

test.describe('Transformations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/transformations')
    await page.waitForLoadState('networkidle')
  })

  test('rend la page avec son titre', async ({ page }) => {
    await expect(page.locator('.eyebrow')).toHaveText('Transformations')
    await expect(page.locator('.sec-title')).toHaveText('Atelier et lots')
  })

  test('rend 4 cartes de métriques de transformations', async ({ page }) => {
    await expect(page.locator('.metric')).toHaveCount(4)
  })

  test('affiche les 12 lots récents', async ({ page }) => {
    await expect(page.locator('.tbl tbody tr')).toHaveCount(12)
  })

  test('le filtre En cours réduit le tableau à 4 lignes', async ({ page }) => {
    await page.getByRole('button', { name: 'En cours', exact: true }).click()
    await expect(page.locator('.tbl tbody tr')).toHaveCount(4)
  })

  test('le filtre Terminé réduit le tableau à 6 lignes', async ({ page }) => {
    await page.getByRole('button', { name: 'Terminé', exact: true }).click()
    await expect(page.locator('.tbl tbody tr')).toHaveCount(6)
  })

  test('la sidebar expose un lien Transformations actif', async ({ page }) => {
    await expect(page.locator('.sb').getByRole('link', { name: 'Transformations' })).toBeVisible()
  })
})
