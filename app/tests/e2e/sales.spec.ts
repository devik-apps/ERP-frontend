import { test, expect } from '@playwright/test'

test.describe('Ventes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  function salesSection(page: import('@playwright/test').Page) {
    return page.locator('section.sec').filter({ has: page.locator('#sales') })
  }

  test('rend la section avec son titre', async ({ page }) => {
    const sec = salesSection(page)
    await sec.scrollIntoViewIfNeeded()
    await expect(sec).toBeVisible()
    await expect(sec.locator('.eyebrow')).toHaveText('Ventes')
    await expect(sec.locator('.sec-title')).toHaveText('Activité commerciale')
  })

  test('rend 4 cartes de métriques de ventes', async ({ page }) => {
    const sec = salesSection(page)
    await sec.scrollIntoViewIfNeeded()
    await expect(sec.locator('.metric')).toHaveCount(4)
  })

  test('affiche les 12 tickets récents', async ({ page }) => {
    const sec = salesSection(page)
    await sec.scrollIntoViewIfNeeded()
    await expect(sec.locator('.tbl tbody tr')).toHaveCount(12)
  })

  test('le filtre Comptoir réduit le tableau à 6 lignes', async ({ page }) => {
    const sec = salesSection(page)
    await sec.scrollIntoViewIfNeeded()
    await sec.getByRole('button', { name: 'Comptoir' }).click()
    await expect(sec.locator('.tbl tbody tr')).toHaveCount(6)
  })

  test('le filtre Restaurant réduit le tableau à 3 lignes', async ({ page }) => {
    const sec = salesSection(page)
    await sec.scrollIntoViewIfNeeded()
    await sec.getByRole('button', { name: 'Restaurant' }).click()
    await expect(sec.locator('.tbl tbody tr')).toHaveCount(3)
  })

  test('la sidebar expose un lien Ventes actif', async ({ page }) => {
    const sb = page.locator('.sb')
    const link = sb.getByRole('button', { name: 'Ventes' })
    await expect(link).toBeVisible()
    await expect(link).toBeEnabled()
  })
})
