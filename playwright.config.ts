import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  expect: {
    timeout: 8_000,
  },
  fullyParallel: false,
  outputDir: '.playwright-results',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: [['list']],
  retries: process.env.CI ? 1 : 0,
  testDir: 'apps/luma-admin/e2e',
  timeout: 45_000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node ../../node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4173',
    cwd: 'apps/luma-admin',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: 'http://127.0.0.1:4173',
  },
  workers: 1,
})
