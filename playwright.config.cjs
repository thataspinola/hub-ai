const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:3100/react-ssr-corp-hubv-painel-administrativo/', trace: 'retain-on-failure', serviceWorkers: 'block', launchOptions: process.env.HUB_AI_E2E_CHROMIUM_PATH ? { executablePath: process.env.HUB_AI_E2E_CHROMIUM_PATH } : {} },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'npm run dev -- --hostname 127.0.0.1 --port 3100', url: 'http://127.0.0.1:3100/react-ssr-corp-hubv-painel-administrativo/', reuseExistingServer: false, timeout: 120000 },
})
