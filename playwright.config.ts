import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PLAYWRIGHT_WEB_PORT ?? '3000';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;
const isCI = !!process.env.CI;

// En CI el frontend lo sirve el stack de compose detrás de Caddy, así que no
// hay dev server que levantar. En local sí: ver e2e/README.md.
const externalServer = !!process.env.PLAYWRIGHT_SKIP_WEBSERVER;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  // AuthController throttles register/login/logout to 10 req/60s per IP
  // (@Throttle({ global: { ttl: 60000, limit: 10 } })). Every spec registers
  // its own user, so a handful of workers front-loading those calls trips
  // that limit almost immediately and every register() past it hangs until
  // its own 60s test timeout. One worker keeps auth traffic serialized —
  // the whole suite still finishes in under a couple of minutes.
  //
  // Esto NO impide repartir la suite en shards: cada shard corre en su propio
  // runner, con su propio stack y su propia instancia de la API, así que cada
  // uno tiene su propio contador de rate limit.
  workers: 1,
  // blob es lo que permite fusionar los shards en un único reporte HTML con
  // `playwright merge-reports`. github anota los fallos sobre el diff del PR.
  reporter: isCI
    ? [['github'], ['blob']]
    : [['html', { open: 'never' }]],
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

  ...(externalServer
    ? {}
    : {
        // Levanta el frontend solo. El backend (API + Mongo + Redis, con el
        // catálogo de ejercicios cargado) se asume corriendo aparte.
        webServer: {
          command: 'npm run dev',
          url: baseURL,
          reuseExistingServer: !isCI,
          timeout: 120_000,
        },
      }),
});
