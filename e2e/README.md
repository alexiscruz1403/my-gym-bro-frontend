# Tests E2E (Playwright)

## Requisitos previos

Estos tests ejercitan la app real contra una API real. Antes de correrlos:

1. Backend levantado y accesible en la URL de `API_URL` (`.env.local`, por defecto `http://localhost:3001/api/v1`): Mongo + Redis + `my-gym-bro-api` (`docker compose up -d mongo redis api` desde la raíz del monorepo, o el equivalente en local).
2. Catálogo de ejercicios sembrado (`docker compose --profile seed run --rm seed`, o `npm run seed:exercises` dentro de `my-gym-bro-api`). Sin esto, el wizard de creación de planes no tiene nada para elegir y varios tests fallan en el picker.
3. Dependencias del frontend instaladas (`npm install`) y navegadores de Playwright descargados (`npx playwright install chromium`).

El frontend (`npm run dev`) lo levanta automáticamente `playwright.config.ts` vía `webServer` — no hace falta arrancarlo a mano.

## Correr los tests

```bash
npm run test:e2e          # headless
npm run test:e2e:ui       # modo interactivo (recomendado la primera vez)
npm run test:e2e:report   # abre el último reporte HTML
```

## Cómo están organizados

Cada spec registra su propio usuario único (`support/user.ts`), así que ningún archivo pisa datos de otro ni choca con el límite de 3 planes por usuario. Igual corren en un solo worker (`playwright.config.ts`): la API limita `/auth/*` a 10 requests/60s por IP, y varios workers registrando usuarios en paralelo superan ese límite enseguida.

- `auth.spec.ts` — registro, cierre e inicio de sesión, y guard de rutas protegidas.
- `plans.spec.ts` — creación de un plan, reordenar ejercicios con drag & drop (dnd-kit), edición y activación.
- `session-and-stats.spec.ts` — sesión completa de principio a fin y su reflejo en Estadísticas.
- `language.spec.ts` — cambio de idioma en Ajustes.
- `offline-sync.spec.ts` — registrar una serie sin red y su sincronización al reconectar.

`support/` tiene los helpers reutilizados por los specs (wizard de planes, drag & drop, avance de sesión, lectura directa de IndexedDB).
