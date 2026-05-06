import { test, expect, type Page } from '@playwright/test'

const API = 'https://api.erp.local/v1'

const PRODUCT_DETAIL = {
  id: 'POI-THO-001',
  label: 'Thon rouge entier',
  category: { id: 'cat-1', label: 'Poissons frais' },
  isActive: true,
  currentStock: 32.4,
  activePriceCount: 4,
  description: 'Thon rouge entier de Méditerranée, pêché à la palangre. Calibre 30–50 kg, livré sous glace.',
}

const PRODUCT_STOCK = {
  product: { id: 'POI-THO-001', label: 'Thon rouge entier' },
  totalQuantity: 32.4,
  totalWeightGrams: 32400,
  lastMovementAt: '2026-05-04T10:12:00Z',
}

const PRODUCT_PRICES = [
  { id: 'price-1', productId: 'POI-THO-001', packaging: { id: 'pkg-1', label: 'Détail'     }, amount: 3800, weightGrams: 1000, isCurrentlyActive: true },
  { id: 'price-2', productId: 'POI-THO-001', packaging: { id: 'pkg-2', label: 'Pro'        }, amount: 3400, weightGrams: 1000, isCurrentlyActive: true },
  { id: 'price-3', productId: 'POI-THO-001', packaging: { id: 'pkg-3', label: 'Restaurant' }, amount: 3250, weightGrams: 1000, isCurrentlyActive: true },
  { id: 'price-4', productId: 'POI-THO-001', packaging: { id: 'pkg-4', label: 'Gros'       }, amount: 2980, weightGrams: 1000, isCurrentlyActive: true },
]

async function mockApi(page: Page) {
  await page.route(`${API}/products/*/stock`, route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify(PRODUCT_STOCK),
  }))
  await page.route(`${API}/products/*/prices*`, route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ data: PRODUCT_PRICES }),
  }))
  await page.route(`${API}/products/*`, route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify(PRODUCT_DETAIL),
  }))
}

test.describe('Fiche produit', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page)
    await page.goto('/products/POI-THO-001')
    await page.waitForLoadState('networkidle')
  })

  test('rend la page avec son titre', async ({ page }) => {
    await expect(page.locator('.sec-title')).toHaveText('Thon rouge entier')
    await expect(page.locator('.eyebrow')).toHaveText('Fiche produit')
  })

  test('affiche le résumé, le bloc stock et le tableau des prix', async ({ page }) => {
    await expect(page.locator('.product-summary')).toBeVisible()
    await expect(page.locator('.product-stock-card')).toBeVisible()
    await expect(page.locator('.product-prices table')).toBeVisible()
  })

  test('le bloc stock affiche 2 items', async ({ page }) => {
    await expect(page.locator('.product-stock-card .stock-item')).toHaveCount(2)
  })

  test('le tableau des prix a 4 lignes', async ({ page }) => {
    await expect(page.locator('.product-prices tbody tr')).toHaveCount(4)
  })
})
