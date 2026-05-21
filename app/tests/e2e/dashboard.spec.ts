import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
  })

  test('rend la page avec son titre', async ({ page }) => {
    await expect(page.locator('.sec-title').first()).toHaveText('Tableau de bord')
  })

  test('rend 4 cartes de métriques', async ({ page }) => {
    await expect(page.locator('.metric')).toHaveCount(4)
  })

  test('affiche la carte CA avec le graphique 7 jours', async ({ page }) => {
    const card = page.locator('.sales-chart-card')
    await expect(card).toBeVisible()
    await expect(card).toContainText("Chiffre d'affaires")
    await expect(card).toContainText('7 derniers jours')
    await expect(card.locator('.sales-chart')).toBeVisible()
  })

  test('affiche les 11 mouvements récents', async ({ page }) => {
    await expect(page.locator('.tbl').first().locator('tbody tr')).toHaveCount(11)
  })

  test('le filtre Entrées réduit le tableau à 8 lignes', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrées' }).click()
    await expect(page.locator('.tbl').first().locator('tbody tr')).toHaveCount(8)
  })

  test('le filtre Sorties réduit le tableau à 3 lignes', async ({ page }) => {
    await page.getByRole('button', { name: 'Sorties' }).click()
    await expect(page.locator('.tbl').first().locator('tbody tr')).toHaveCount(3)
  })
})
