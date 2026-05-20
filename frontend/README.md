# Library Management — Frontend

Production-ready **Next.js 15** application for the Library Management System. Built with TypeScript, TanStack Query, Tailwind CSS, and a portfolio-grade UX layer.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS, shadcn-style UI |
| Data | TanStack Query, Axios |
| Forms | React Hook Form, Zod |
| State | Zustand |
| Charts | Recharts (lazy-loaded) |
| Notifications | Sonner |

## Architecture

```
frontend/
├── public/                 # Static assets, service worker, favicon
├── src/
│   ├── app/                # App Router pages & route layouts
│   ├── features/           # Domain modules (auth, books, borrow, admin)
│   ├── shared/             # UI, hooks, config, UX system
│   ├── providers/          # React context providers
│   ├── services/api/       # Axios client & error types
│   ├── pwa/                # Service worker registration
│   └── store/              # Zustand stores
├── Dockerfile              # Multi-stage production image
└── next.config.ts          # Standalone output, image & bundle optimization
```

### Design principles

- **Feature-based modules** — colocate API, hooks, components, and types per domain.
- **No hardcoded URLs** — all public config via `src/shared/config/env.ts`.
- **Centralized UX** — `GlobalErrorBoundary`, `APIErrorHandler`, loaders, skeletons, offline banner.
- **Code splitting** — heavy charts loaded with `next/dynamic` and `ssr: false`.

## Prerequisites

- **Node.js** 20+
- **npm** 10+
- Running **backend API** (default `http://localhost:8080/api`)

## Setup Guide

**Canonical local URLs:** frontend `http://localhost:3000`, API `http://localhost:8080/api`.  
See the root [README — Standard local setup](../README.md#standard-local-setup-one-scenario).

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

| Variable | Local dev value | Purpose |
|----------|-----------------|--------|
| `NEXT_PUBLIC_API_URL` | `/api` | Same-origin requests (proxied) |
| `API_PROXY_TARGET` | `http://localhost:8080` | Next.js → Spring Boot (must match root `.env` `APP_PORT`) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | SEO / metadata |
| `NEXT_PUBLIC_APP_NAME` | `Library Management System` | Branding |
| `NEXT_PUBLIC_PWA_ENABLED` | `false` | Service worker |

> For **Docker frontend image** builds only, set `NEXT_PUBLIC_API_URL=http://localhost:8080/api` at build time.  
> For **`npm run dev`**, keep `/api` + `API_PROXY_TARGET` as above.

### 3. Run development server

```bash
npm run dev
```

Always opens on port **3000** (`next dev -p 3000`).  
Open [http://localhost:3000](http://localhost:3000).

### 4. Production build (local)

```bash
npm run build
npm run start
```

## Docker Guide

### Build image

From the `frontend/` directory:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080/api \
  --build-arg NEXT_PUBLIC_APP_NAME="Library Management System" \
  --build-arg NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  -t library-frontend .
```

Or use the npm script:

```bash
npm run docker:build
```

### Run container

```bash
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://host.docker.internal:8080/api \
  library-frontend
```

The browser must reach the API URL configured at build time. When users access the app at `localhost:3000`, use `http://localhost:8080/api` (not the internal Docker hostname `app`).

### Image optimization

The Dockerfile uses:

- **Multi-stage build** — deps → builder → minimal runner
- **Alpine** base images
- **Next.js `output: "standalone"`** — only production server files in the final layer
- **Non-root** `nextjs` user
- **Health check** on port 3000

## Full Stack Deployment (`docker-compose`)

From the repository root:

```bash
cp .env.example .env
# Edit DB credentials, JWT_SECRET, and frontend URLs

docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api |
| PostgreSQL | internal `postgres:5432` |

Add to root `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=Library Management System
NEXT_PUBLIC_APP_URL=http://localhost:3000
FRONTEND_PORT=3000
```

## SEO

- **Metadata** — `src/shared/lib/seo.ts` (`createMetadata`, OpenGraph, Twitter cards)
- **`robots.txt`** — `src/app/robots.ts`
- **`sitemap.xml`** — `src/app/sitemap.ts`
- **Web manifest** — `src/app/manifest.ts` + `public/manifest.webmanifest`
- **Favicon** — `public/favicon.svg`

## PWA Architecture

Progressive Web App support is prepared but **disabled by default**.

| File | Purpose |
|------|---------|
| `public/sw.js` | Service worker (precache + offline fallback) |
| `src/pwa/register-service-worker.ts` | Registration API |
| `src/providers/pwa-provider.tsx` | Client-side registration on mount |
| `src/app/offline/page.tsx` | Offline fallback UI |

Enable PWA:

```env
NEXT_PUBLIC_PWA_ENABLED=true
```

Rebuild the app. The service worker caches shell routes and serves `/offline` when navigation fails offline. API calls are not cached (always network-first).

### Installable app

With PWA enabled, supported browsers offer “Install app” via the web manifest (`display: standalone`).

## Production Features

- **Image optimization** — AVIF/WebP via `next/image`
- **Bundle optimization** — `optimizePackageImports` for lucide-react and Radix (recharts excluded — breaks webpack chunks in dev)
- **Charts** — Recharts on admin dashboard via direct client import
- **Compression** — enabled in Next.js config
- **Standalone output** — minimal Docker runtime

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Vitest unit tests |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:e2e` | Playwright smoke tests (starts dev server locally) |
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Run Docker image locally |

## Testing

- **Unit tests (Vitest):** `src/**/*.test.ts` — API error parsing, books query helpers
- **E2E (Playwright):** `e2e/smoke.spec.ts` — public auth pages (run with backend optional for smoke UI)

```bash
npm test
npx playwright install chromium   # first time only
npm run test:e2e
```

## Environment-specific URLs

| Environment | Browser → API | Config |
|-------------|---------------|--------|
| **Local dev (recommended)** | `http://localhost:3000/api/*` → proxy → `:8080` | `NEXT_PUBLIC_API_URL=/api`, `API_PROXY_TARGET=http://localhost:8080` |
| Docker full stack | `http://localhost:8080/api` | root `.env` `NEXT_PUBLIC_API_URL` at image build |
| Production | `https://your-domain.com/api` | reverse proxy + build-time env |

Never commit `.env.local`. Only `NEXT_PUBLIC_*` are exposed in the client bundle; `API_PROXY_TARGET` is server-only.

## License

Part of the Library Management System portfolio project.
