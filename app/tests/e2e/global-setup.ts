import { chromium, type FullConfig } from '@playwright/test'

const log = (msg: string) => console.log(`[e2e:warmup] ${msg}`)

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL ?? 'http://localhost:3000'
  const browser = await chromium.launch()
  const page = await browser.newPage()

  log(`pré-chauffage ${baseURL}…`)
  const start = Date.now()
  await page.goto(baseURL, { waitUntil: 'load', timeout: 120_000 })
  log(`serveur prêt en ${((Date.now() - start) / 1000).toFixed(1)}s`)

  await browser.close()
}
