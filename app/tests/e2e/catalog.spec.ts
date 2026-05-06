import { test, expect, type Page } from '@playwright/test'

const API = 'https://api.erp.local/v1'

const CATEGORIES = [
  { id: 'cat-1', label: 'Poissons frais', isActive: true },
  { id: 'cat-2', label: 'Préparations',   isActive: true },
  { id: 'cat-3', label: 'Crustacés',      isActive: true },
  { id: 'cat-4', label: 'Coquillages',    isActive: true },
  { id: 'cat-5', label: 'Fumés',          isActive: true },
]

const PRODUCTS = [
  { id: 'prod-001', label: 'Thon rouge entier',  category: { id: 'cat-1', label: 'Poissons frais' }, isActive: true,  currentStock: 32.4, activePriceCount: 4 },
  { id: 'prod-002', label: 'Saumon d\'Écosse',   category: { id: 'cat-1', label: 'Poissons frais' }, isActive: true,  currentStock: 42.6, activePriceCount: 2 },
  { id: 'prod-003', label: 'Daurade royale',      category: { id: 'cat-1', label: 'Poissons frais' }, isActive: true,  currentStock: 18.3, activePriceCount: 2 },
  { id: 'prod-004', label: 'Bar de ligne',        category: { id: 'cat-1', label: 'Poissons frais' }, isActive: true,  currentStock: 21.6, activePriceCount: 2 },
  { id: 'prod-005', label: 'Cabillaud',           category: { id: 'cat-1', label: 'Poissons frais' }, isActive: true,  currentStock: 14.8, activePriceCount: 2 },
  { id: 'prod-006', label: 'Lotte (queue)',       category: { id: 'cat-1', label: 'Poissons frais' }, isActive: false, currentStock: 0,    activePriceCount: 0 },
  { id: 'prod-007', label: 'Filet de saumon',    category: { id: 'cat-2', label: 'Préparations'   }, isActive: true,  currentStock: 8.6,  activePriceCount: 2 },
  { id: 'prod-008', label: 'Filet de bar',        category: { id: 'cat-2', label: 'Préparations'   }, isActive: true,  currentStock: 4.2,  activePriceCount: 2 },
  { id: 'prod-009', label: 'Tartare de thon',    category: { id: 'cat-2', label: 'Préparations'   }, isActive: true,  currentStock: 1.6,  activePriceCount: 2 },
  { id: 'prod-010', label: 'Saumon fumé',         category: { id: 'cat-5', label: 'Fumés'          }, isActive: true,  currentStock: 6.4,  activePriceCount: 2 },
  { id: 'prod-011', label: 'Crevettes roses',    category: { id: 'cat-3', label: 'Crustacés'      }, isActive: true,  currentStock: 3.0,  activePriceCount: 2 },
  { id: 'prod-012', label: 'Langoustines',        category: { id: 'cat-3', label: 'Crustacés'      }, isActive: true,  currentStock: 1.2,  activePriceCount: 2 },
  { id: 'prod-013', label: 'Saint-Jacques',       category: { id: 'cat-4', label: 'Coquillages'    }, isActive: true,  currentStock: 2.8,  activePriceCount: 2 },
  { id: 'prod-014', label: 'Huîtres n°3',         category: { id: 'cat-4', label: 'Coquillages'    }, isActive: true,  currentStock: 24.0, activePriceCount: 2 },
  { id: 'prod-015', label: 'Moules de bouchot',  category: { id: 'cat-4', label: 'Coquillages'    }, isActive: true,  currentStock: 11.4, activePriceCount: 2 },
]

async function mockApi(page: Page) {
  await page.route(`${API}/categories*`, route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ data: CATEGORIES, meta: { total: 5, page: 1, limit: 10, totalPages: 1 } }),
  }))
  await page.route(`${API}/products*`, route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ data: PRODUCTS, meta: { total: 15, page: 1, limit: 50, totalPages: 1 } }),
  }))
}

test.describe('Catalogue produits', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page)
    await page.goto('/products')
    await page.waitForLoadState('networkidle')
  })

  test('rend la page avec son titre', async ({ page }) => {
    await expect(page.locator('.sec-title')).toHaveText('Catalogue')
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
