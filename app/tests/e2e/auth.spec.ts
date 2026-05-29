import 'dotenv/config'
import { test, expect } from '@playwright/test'

test.describe('Authentification — /login', () => {
  test('redirige vers /login depuis une route protégée quand non connecté', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login$/)
  })

  test('affiche le formulaire (email + mot de passe + bouton)', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('affiche un message d\'erreur quand les identifiants sont invalides', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.fill('input[type="email"]', 'inexistant@nowhere.test')
    await page.fill('input[type="password"]', 'mauvais-mot-de-passe-x9')
    await page.click('button[type="submit"]')
    await expect(page.locator('.login-error')).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('se connecte avec les identifiants valides et atterrit sur /dashboard', async ({ page }) => {
    const email = process.env.E2E_SUPABASE_EMAIL
    const password = process.env.E2E_SUPABASE_PASSWORD
    test.skip(!email || !password, 'E2E_SUPABASE_EMAIL/PASSWORD non définis')

    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.fill('input[type="email"]', email!)
    await page.fill('input[type="password"]', password!)
    await Promise.all([
      page.waitForURL('**/dashboard'),
      page.click('button[type="submit"]'),
    ])
    await expect(page.locator('.sec-title').first()).toHaveText('Tableau de bord')
  })

  test('le bouton de déconnexion ramène vers /login', async ({ page }) => {
    const email = process.env.E2E_SUPABASE_EMAIL
    const password = process.env.E2E_SUPABASE_PASSWORD
    test.skip(!email || !password, 'E2E_SUPABASE_EMAIL/PASSWORD non définis')

    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.fill('input[type="email"]', email!)
    await page.fill('input[type="password"]', password!)
    await Promise.all([
      page.waitForURL('**/dashboard'),
      page.click('button[type="submit"]'),
    ])

    await Promise.all([
      page.waitForURL('**/login'),
      page.click('button.topbar-logout'),
    ])
  })
})
