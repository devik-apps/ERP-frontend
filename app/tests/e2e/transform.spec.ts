import { test, expect } from '@playwright/test'

test.describe('Transformations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  function transformSection(page: import('@playwright/test').Page) {
    return page.locator('section.sec').filter({ has: page.locator('#transform') })
  }

  test('rend la section avec son titre', async ({ page }) => {
    const sec = transformSection(page)
    await sec.scrollIntoViewIfNeeded()
    await expect(sec).toBeVisible()
    await expect(sec.locator('.eyebrow')).toHaveText('Transformations')
    await expect(sec.locator('.sec-title')).toHaveText('Atelier et lots')
  })

  test('rend 4 cartes de métriques de transformations', async ({ page }) => {
    const sec = transformSection(page)
    await sec.scrollIntoViewIfNeeded()
    await expect(sec.locator('.metric')).toHaveCount(4)
  })

  test('affiche les 12 lots récents', async ({ page }) => {
    const sec = transformSection(page)
    await sec.scrollIntoViewIfNeeded()
    await expect(sec.locator('.tbl tbody tr')).toHaveCount(12)
  })

  test('le filtre En cours réduit le tableau à 4 lignes', async ({ page }) => {
    const sec = transformSection(page)
    await sec.scrollIntoViewIfNeeded()
    await sec.getByRole('button', { name: 'En cours', exact: true }).click()
    await expect(sec.locator('.tbl tbody tr')).toHaveCount(4)
  })

  test('le filtre Terminé réduit le tableau à 6 lignes', async ({ page }) => {
    const sec = transformSection(page)
    await sec.scrollIntoViewIfNeeded()
    await sec.getByRole('button', { name: 'Terminé', exact: true }).click()
    await expect(sec.locator('.tbl tbody tr')).toHaveCount(6)
  })

  test('la sidebar expose un lien Transformations actif', async ({ page }) => {
    const sb = page.locator('.sb')
    const link = sb.getByRole('button', { name: 'Transformations' })
    await expect(link).toBeVisible()
    await expect(link).toBeEnabled()
  })
})
