import { test, expect } from '@playwright/test'

test.describe('ERP Poissonnerie', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
  })

  test('la page se charge sans erreur', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))
    await page.waitForSelector('.app')
    expect(errors).toHaveLength(0)
  })

  test('le titre contient "Poissonnerie"', async ({ page }) => {
    await expect(page).toHaveTitle(/Poissonnerie/)
  })
})

test.describe('Layout — sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('la sidebar est visible', async ({ page }) => {
    await expect(page.locator('aside.sb')).toBeVisible()
  })

  test('affiche le nom de l\'enseigne', async ({ page }) => {
    await expect(page.locator('.sb-brand-name')).toHaveText('Poissonnerie')
  })

  test('contient les liens de navigation principaux', async ({ page }) => {
    const sb = page.locator('.sb')
    await expect(sb.getByRole('link', { name: 'Tableau de bord' })).toBeVisible()
    await expect(sb.getByRole('link', { name: 'Produits' })).toBeVisible()
    await expect(sb.getByRole('link', { name: 'Stock', exact: true })).toBeVisible()
    await expect(sb.getByRole('link', { name: 'Ventes' })).toBeVisible()
  })

  test('affiche l\'utilisateur en pied de sidebar', async ({ page }) => {
    await expect(page.locator('.sb-user-name')).toBeVisible()
  })
})

test.describe('Layout — topbar', () => {
  test('affiche le fil d\'ariane', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.crumbs')).toBeVisible()
  })
})
