import { test, expect, type Page } from '@playwright/test'

const API = 'https://api.erp.local/v1'

const TRANSFORMATIONS = [
  { id: 'tr-001', transformedAt: '2026-05-04T09:00:00Z', inputs: [], outputs: [], totalInputWeightGrams: 14200, totalOutputWeightGrams: 9800, totalLossGrams: 4400, lossRatio: 0.31, isActive: true },
  { id: 'tr-002', transformedAt: '2026-05-04T10:00:00Z', inputs: [], outputs: [], totalInputWeightGrams: 6400,  totalOutputWeightGrams: 4200, totalLossGrams: 2200, lossRatio: 0.34, isActive: true },
]

async function mockApi(page: Page) {
  await page.route(`${API}/transformations*`, route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ data: TRANSFORMATIONS, meta: { total: 7, page: 1, limit: 50, totalPages: 1 } }),
  }))
}

test.describe('Transformations', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page)
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

  test('affiche les lots renvoyés par /transformations', async ({ page }) => {
    await expect(page.locator('.tbl tbody tr')).toHaveCount(2)
  })

  test('la sidebar expose un lien Transformations actif', async ({ page }) => {
    await expect(page.locator('.sb').getByRole('link', { name: 'Transformations' })).toBeVisible()
  })
})
