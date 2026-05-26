import { test as setup, expect } from '@playwright/test'

const STORAGE_STATE = 'app/tests/e2e/.auth/user.json'

setup('connexion via /login', async ({ page }) => {
  const email = process.env.E2E_SUPABASE_EMAIL
  const password = process.env.E2E_SUPABASE_PASSWORD

  if (!email || !password) {
    throw new Error(
      'E2E_SUPABASE_EMAIL et E2E_SUPABASE_PASSWORD doivent être définis (cf. .env.example).\n' +
      'Créer un utilisateur dans le dashboard Supabase puis renseigner ces variables dans .env.',
    )
  }

  await page.goto('/login')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await Promise.all([
    page.waitForURL('**/dashboard'),
    page.click('button[type="submit"]'),
  ])

  await expect(page.locator('.topbar-user')).toContainText(email)
  await page.context().storageState({ path: STORAGE_STATE })
})
