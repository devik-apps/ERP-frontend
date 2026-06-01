import { test, expect } from '@playwright/test'

test.describe('PWA — head', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
  })

  test('lie le manifest', async ({ page }) => {
    const href = await page.locator('link[rel="manifest"]').getAttribute('href')
    expect(href).toBe('/manifest.webmanifest')
  })

  test('définit theme-color slate', async ({ page }) => {
    const c = await page.locator('meta[name="theme-color"]').getAttribute('content')
    expect(c?.toUpperCase()).toBe('#4A6274')
  })

  test('lie l\'apple-touch-icon', async ({ page }) => {
    const href = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href')
    expect(href).toBe('/icons/apple-touch-icon.svg')
  })

  test('expose un favicon SVG', async ({ page }) => {
    const href = await page.locator('link[rel="icon"][type="image/svg+xml"]').getAttribute('href')
    expect(href).toBe('/icons/icon.svg')
  })
})

test.describe('PWA — manifest servi', () => {
  test('manifest accessible et bien typé', async ({ request }) => {
    const res = await request.get('/manifest.webmanifest')
    expect(res.ok()).toBe(true)
    const body = await res.json()
    expect(body.name).toContain('Fishoo')
    expect(body.display).toBe('standalone')
  })

  test('icône SVG accessible', async ({ request }) => {
    const res = await request.get('/icons/icon.svg')
    expect(res.ok()).toBe(true)
  })
})
