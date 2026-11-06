const { define, devices } = require('@playwright/test')

const basePath = '/react-ssr-corp-hubv-painel-administrativo'
const baseUrl = `http://localhost:3100${basePath}/`

module.exports = defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporters: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: baseUrl,
    trace: 'retain-on-failure',
    serviceWorkers: 'block',
  },
  projects: [
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    { name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
  ],
  webServer: {
    command: 'npm run dev -- --hostname localhost --port 3100',
    url: baseUrl,
    reuseExistingServer: false,
    timeout: 120000, // 2 minutes
  },
})
