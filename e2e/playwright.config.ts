import { defineConfig } from '@playwright/test';

// Artifacts (videos, screenshots, traces, HTML report) land in ./e2e/artifacts
// which is bind-mounted to the host so they can be inspected/analyzed.
export default defineConfig({
  testDir: './tests',
  timeout: 180_000,
  expect: { timeout: 20_000 },
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: '/e2e/artifacts/report', open: 'never' }],
  ],
  outputDir: '/e2e/artifacts/test-results',
  use: {
    headless: true,
    viewport: { width: 1440, height: 900 },
    video: 'on',
    screenshot: 'on',
    trace: 'on',
    actionTimeout: 25_000,
    navigationTimeout: 45_000,
    ignoreHTTPSErrors: true,
  },
});
