import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

const STORAGE_STATE = 'app/tests/e2e/.auth/user.json'

export default defineConfig({
  testDir: './app/tests/e2e',
  testMatch: '**/*.spec.ts',
  globalSetup: './app/tests/e2e/global-setup.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    serviceWorkers: 'block',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'auth-ui',
      testMatch: /auth\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium',
      testIgnore: [/auth\.spec\.ts/, /auth\.setup\.ts/],
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
  ],

  webServer: {
    command: process.env.CI ? 'pnpm preview' : 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
