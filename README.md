# MyGymBro — Personal Training App

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://my-gym-bro-frontend.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> **Live app:** [https://my-gym-bro-frontend.vercel.app](https://my-gym-bro-frontend.vercel.app)

MyGymBro is a full-featured Progressive Web App (PWA) for personal strength training. It covers the complete training loop — plan, train, track, review — with social features, AI-generated programs, gamification, and full offline support built in.

---

## Table of Contents

- [Main Idea](#main-idea)
- [Features](#features)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Technical Decisions](#technical-decisions)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [License](#license)

---

## Main Idea

Most gym apps are either too simple (just a timer) or too complex for daily use. MyGymBro aims to be the tool a serious lifter actually keeps open at the gym: fast session logging, smart progression suggestions, and a social layer that makes training less solitary — all while working reliably with no internet connection.

The app is built around four pillars:

1. **Training** — Create structured workout plans, run live sessions with set logging and rest timers, and review your history.
2. **Progress** — Track volume, personal records, muscle group breakdown, and streaks over time.
3. **Social** — Follow other users, share completed sessions, react and comment on a social feed.
4. **Intelligence** — AI-generated workout plans, progression analysis, and exercise swap suggestions.

---

## Features

### Workout Planning
- Multi-day workout plans with a step-by-step creation wizard
- Drag-and-drop exercise reordering within days
- Superset grouping support
- Duplicate plans, copy days between plans
- Activate/deactivate plans

### Active Session Tracking
- Log sets (weight × reps) in real time
- Countdown rest timer between sets
- Floating active-session widget (visible across all pages during a session)
- Full offline support — sessions are saved to IndexedDB and synced later
- Swap exercises mid-session with AI suggestions

### History & Statistics
- Complete session history with per-exercise breakdowns
- Personal records (PRs) per exercise
- Weekly/monthly volume charts (Recharts)
- Muscle group radar chart and ranking
- Exercise-level history and progression graphs

### Muscle Recovery
- Per-muscle-group recovery tracking based on recent session data
- Color-coded recovery indicators

### Social Feed
- Public feed of shared workout sessions and posts
- Reactions and comments on posts
- Follow / unfollow users with optional follow request approval
- Public user profiles with session history

### Gamification
- Training streaks (current and longest)
- Unlockable achievements with animations on unlock
- Collectible user titles displayed on your profile
- Global and per-exercise leaderboards

### AI Features
- 6-step AI wizard to generate a personalized workout plan
- AI progression analysis with specific recommendations per exercise
- AI-powered exercise swap suggestions during sessions

### Notifications
- Real-time in-app notifications via WebSocket (Socket.io)
- Web Push notifications (VAPID / Push Manager API)
- Notification preferences per category
- Unread count badge

### Offline Support
- Fully offline-capable: plans, exercises, session, and history are cached in IndexedDB (Dexie)
- Mutation queue persists failed writes and replays them on reconnect
- Temporary IDs (`offline_*`) are reconciled with server IDs after sync
- Offline banner and sync status indicator

### PWA
- Installable on desktop and mobile
- Standalone display mode (no browser chrome)
- Adaptive icons (192×192 and 512×512 maskable)

### Admin Panel
- User management (roles, bans, search)
- Exercise catalog administration (create, edit, delete)
- Payment log viewer
- System monitoring dashboard
- Terms of service editor

### Subscription
- Premium subscription flow (Stripe-compatible backend)
- Post-checkout success page
- Subscription status check

### Internationalization
- English and Spanish (i18next + react-i18next)
- Language preference saved per user account

### Data Export
- Export session history as PDF or CSV

---

## Architecture

```
Browser
  └── Next.js 15 App Router
        ├── (auth) group   — Public routes (login, register, OAuth, forgot/reset password)
        └── (app) group    — Protected routes (all app pages)
              ├── AppHeader + SideNav + BottomNav
              ├── SessionGuard (middleware-level auth check)
              └── Pages → Components → Hooks → Services → Zustand / React Query
```

### Layer Breakdown

| Layer | Responsibility |
|---|---|
| **Pages** (`src/app/`) | Next.js route segments; thin shell, delegates to feature components |
| **Components** (`src/components/`) | Feature UI, organized by domain (workout, session, social, etc.) |
| **Hooks** (`src/hooks/`) | Data fetching (React Query), mutations, and stateful UI logic |
| **Services** (`src/services/`) | Pure Axios wrappers — one file per API resource, no state |
| **Store** (`src/store/`) | Zustand slices for client-only state (auth, active session, offline queue, UI) |
| **Lib** (`src/lib/`) | Axios instance, Dexie DB, sync manager, api-routes constants, utilities |

### Authentication Flow

1. User submits login/register → backend sets `access_token` and `refresh_token` as **httpOnly cookies**.
2. Axios sends cookies automatically (`withCredentials: true`) — tokens are never readable in JavaScript.
3. On 401, the Axios interceptor queues all in-flight requests, performs a single `/auth/refresh`, then retries the queue.
4. Next.js middleware reads the cookie server-side to protect routes before rendering.

### Offline-First Flow

```
User action (offline)
  └── Axios interceptor detects network error
        └── Mutation is serialized → written to Dexie mutationQueue
              └── UI shows optimistic result with temp ID (offline_uuid)

User comes back online
  └── SyncManager reads mutationQueue
        ├── Sends mutations in order with X-Idempotency-Key headers
        ├── Maps temp IDs → server IDs in idMap table
        └── Invalidates React Query cache → UI reflects real data
```

---

## Directory Structure

```
gym-planner-frontend/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # App icons
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Login, register, OAuth, password reset
│   │   ├── (app)/             # All protected pages
│   │   │   ├── dashboard/
│   │   │   ├── workout/       # Plans list, detail, edit, new, exercises
│   │   │   ├── session/       # Active session screen
│   │   │   ├── history/       # Session history + detail
│   │   │   ├── feed/          # Social feed
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   ├── notifications/
│   │   │   ├── ranks/
│   │   │   ├── ai/            # AI landing + generate wizard
│   │   │   ├── admin/
│   │   │   ├── users/[id]/    # Public profiles
│   │   │   └── subscription/
│   │   ├── faq/
│   │   ├── terms/
│   │   ├── layout.tsx         # Root layout + providers
│   │   └── page.tsx           # Redirect → /dashboard
│   ├── components/            # ~197 components, organized by domain
│   │   ├── ui/                # shadcn/ui base primitives
│   │   ├── layout/            # AppHeader, SideNav, BottomNav, SessionGuard
│   │   ├── workout/           # Plan cards, wizard, exercise picker
│   │   ├── session/           # Set rows, rest timer, finish dialog
│   │   ├── history/           # History lists and detail views
│   │   ├── exercises/         # Exercise catalog, filters, detail
│   │   ├── stats/             # Charts, radar, volume panels
│   │   ├── social/            # Follow button, feed, comments
│   │   ├── notifications/     # Bell, list, provider
│   │   ├── achievements/      # Badges, unlock animation
│   │   ├── rewards/           # Streak animations
│   │   ├── ranks/             # Leaderboard panels
│   │   ├── ai/                # AI wizard steps, landing page
│   │   ├── admin/             # Admin management panels
│   │   └── shared/            # OfflineBanner, Pagination, InstallPwaBanner
│   ├── hooks/                 # 55+ custom hooks
│   ├── services/              # 18 Axios service modules
│   ├── store/                 # 7 Zustand stores
│   ├── lib/
│   │   ├── axios.ts           # Axios instance + interceptors
│   │   ├── db.ts              # Dexie IndexedDB schema
│   │   ├── offline-queue.ts   # Mutation queue (read/write)
│   │   ├── sync-manager.ts    # Online sync orchestration
│   │   ├── id-reconciler.ts   # Temp ID → server ID resolution
│   │   ├── api-routes.ts      # All API endpoint constants
│   │   ├── query-client.ts    # React Query client
│   │   └── utils.ts           # General helpers
│   ├── types/
│   │   ├── domain.types.ts    # Core domain models
│   │   ├── api.types.ts       # Request/response shapes
│   │   ├── ui.types.ts        # Component prop types
│   │   └── recovery.types.ts
│   ├── i18n/
│   │   ├── config.ts
│   │   ├── I18nProvider.tsx
│   │   └── locales/
│   │       ├── en.ts          # ~50 KB of English strings
│   │       └── es.ts          # ~53 KB of Spanish strings
│   └── middleware.ts          # Next.js route protection
├── next.config.ts             # Next.js + PWA (Workbox) config
├── tailwind.config.ts
├── tsconfig.json
├── components.json            # shadcn/ui config
└── .env.example
```

---

## Technical Decisions

### httpOnly Cookies for Authentication
Tokens are never stored in `localStorage` or accessible via JavaScript. The backend sets `access_token` and `refresh_token` as httpOnly cookies. This eliminates XSS-based token theft. The Axios instance uses `withCredentials: true` to include them automatically on every request.

### Offline-First with Dexie (IndexedDB)
Rather than treating offline as an error state, the app writes every action to IndexedDB first. A persistent mutation queue replays failed API calls when connectivity returns. This means users can complete an entire training session underground and sync the results afterward.

### Temporary ID Reconciliation
When creating resources offline (e.g., logging a set), the app generates a temporary `offline_*` UUID. The ID reconciler maintains a mapping table (`idMap`) between temp and server IDs and patches all subsequent payloads before sending, ensuring related mutations reference the correct server resource.

### Workbox Dual-Caching Strategy
- **HTML pages** → `NetworkFirst` (3 s timeout, then offline cache fallback) — users see fresh UI but gracefully fall back to cached pages.
- **API routes** → `NetworkOnly` — API responses are never served from cache to avoid stale session or training data.

### Token Refresh Queue
The Axios interceptor detects 401 responses and holds all concurrent requests in a promise queue. A single `/auth/refresh` call is made; on success, all queued requests are retried. This prevents multiple simultaneous refresh attempts.

### React Query + Zustand Separation
Server-derived state (workout plans, sessions, feed) lives in React Query with appropriate stale times. Client-only state (active session draft, UI overlays, offline sync status) lives in Zustand. The two layers don't overlap, which keeps cache invalidation predictable.

### Tailwind v4 + OKLch Color Space
Design tokens are defined in `globals.css` using Tailwind v4's `@theme` directive with OKLch color values. OKLch is perceptually uniform, so light and dark palette variants maintain consistent perceived contrast without manual tweaking.

### Turbopack in Development
`npm run dev` uses `--turbopack` for incremental compilation. On a project with 339 TypeScript files, this significantly reduces hot-reload times during development.

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15.5 (App Router), React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4, shadcn/ui (Radix primitives), Framer Motion 12 |
| **Server State** | TanStack React Query 5 |
| **Client State** | Zustand 5 |
| **Forms & Validation** | React Hook Form 7, Zod 4 |
| **HTTP Client** | Axios 1.14 |
| **Real-time** | Socket.io-client 4.8 |
| **Offline / DB** | Dexie 4 (IndexedDB wrapper) |
| **PWA** | @ducanh2912/next-pwa (Workbox) |
| **Charts** | Recharts 3 |
| **Drag & Drop** | @dnd-kit/core + @dnd-kit/sortable |
| **Internationalization** | i18next 26, react-i18next 17 |
| **Notifications (push)** | Web Push API (VAPID) |
| **Icons** | Lucide React |
| **Toasts** | Sonner |
| **Dates** | date-fns 4 |
| **Sanitization** | isomorphic-dompurify |
| **CDN / Images** | Cloudinary (via Next.js Image optimization) |
| **Fonts** | Inter (body), Oswald (display headers) |
| **Linting** | ESLint 9 (flat config, next/core-web-vitals) |
| **Deployment** | Vercel |

---

## Installation

> **Note:** This is the frontend only. You need a running instance of the MyGymBro backend to use the API. See the backend repository for setup instructions.

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Clone the repository
git clone https://github.com/alexiscruz1403/gym-planner-frontend.git
cd gym-planner-frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Open .env.local and fill in your backend URLs (see below)

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the REST API | `http://localhost:3001/api/v1` |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL (Socket.io) | `http://localhost:3001` |
| `NEXT_PUBLIC_GOOGLE_AUTH_URL` | Google OAuth redirect URL (optional) | `http://localhost:3001/api/v1/auth/google` |

All variables are prefixed with `NEXT_PUBLIC_` so they are available in the browser bundle. No secrets belong here — tokens are managed exclusively via httpOnly cookies set by the backend.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server with Turbopack |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across the project |

---

## License

This project is licensed under the [MIT License](LICENSE).
