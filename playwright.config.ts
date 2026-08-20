import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PLAYWRIGHT_WEB_PORT ?? '3000';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // AuthController throttles register/login/logout to 10 req/60s per IP
  // (@Throttle({ global: { ttl: 60000, limit: 10 } })). Every spec registers
  // its own user, so a handful of workers front-loading those calls trips
  // that limit almost immediately and every register() past it hangs until
  // its own 60s test timeout. One worker keeps auth traffic serialized —
  // the whole suite still finishes in under a couple of minutes.
  workers: 1,
  reporter: [['html', { open: 'never' }]],
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Levanta el frontend solo. El backend (API + Mongo + Redis, con el
  // catálogo de ejercicios sembrado) se asume corriendo aparte — ver
  // e2e/README.md.
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
