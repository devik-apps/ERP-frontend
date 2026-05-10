import { test, expect, type Page } from '@playwright/test'

const API = 'https://api.erp.local/v1'

const SUPPLIERS = [
  { id: 'sup-001', name: 'Mareyeur Sète',       contact: 'Jean Petit',       description: 'Poissons frais',  isActive: true  },
  { id: 'sup-002', name: 'Loch Duart Ltd',       contact: 'Andrew MacLeod',  description: 'Saumon Écosse',   isActive: true  },
  { id: 'sup-003', name: 'Élevage Corse SARL',  contact: 'Pierre Colonna',   description: 'Daurades',        isActive: true  },
  { id: 'sup-004', name: 'Pêche Bretagne Coop',  contact: 'Yves Kerlan',      description: 'Bars de ligne',   isActive: true  },
  { id: 'sup-005', name: 'Mer du Nord Import',   contact: 'Thomas Duval',     description: 'Cabillaud',       isActive: true  },
  { id: 'sup-006', name: 'Marennes Oléron AOC',  contact: 'Claire Morin',     description: 'Huîtres',         isActive: true  },
  { id: 'sup-007', name: 'Baie Saint-Brieuc',    contact: 'Gilles Tanguy',    description: 'Saint-Jacques',   isActive: true  },
  { id: 'sup-008', name: 'MSM Moules',           contact: 'René Leblanc',     description: 'Moules',          isActive: false },
  { id: 'sup-009', name: 'Madagascar Seafood',   contact: 'Paul Ratsimba',    description: 'Crevettes',       isActive: true  },
  { id: 'sup-010', name: "Équip' Marée",          contact: 'Sophie Martin',    description: 'Équipement',      isActive: false },
]

async function mockApi(page: Page) {
  await page.route(`${API}/suppliers*`, route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ data: SUPPLIERS, meta: { total: 10, page: 1, limit: 50, totalPages: 1 } }),
  }))
}

test.describe('Fournisseurs', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page)
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

  test('le filtre Inactif réduit le tableau à 2 lignes', async ({ page }) => {
    await page.locator('[data-filter="status"]').getByRole('button', { name: 'Inactif' }).click()
    await expect(page.locator('.tbl tbody tr')).toHaveCount(2)
  })

  test('la sidebar expose un lien Fournisseurs actif', async ({ page }) => {
    await expect(page.locator('.sb').getByRole('link', { name: 'Fournisseurs' })).toBeVisible()
  })
})
