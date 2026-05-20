# Operations guide

## CI/CD

GitHub Actions workflow: `.github/workflows/ci.yml`

| Job | What it runs |
|-----|----------------|
| `backend` | `mvn test`, `mvn package` |
| `backend-postgres` | PostgreSQL Testcontainers search/pagination tests (`@Tag("postgres")`) |
| `openapi` | Generates `target/openapi/openapi.json` (springdoc enabled; prod keeps docs off) |
| `frontend` | lint, typecheck, unit tests, production build |

OpenAPI artifact is uploaded per workflow run for API consumers.

## Staging

```bash
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d
```

- Backend profile: `staging` (JSON logs, Prometheus on `/api/actuator/prometheus`)
- Ports default to **8081** (API) and **3001** (frontend) to avoid clashing with local dev

Optional monitoring profile:

```bash
docker compose -f docker-compose.yml -f docker-compose.staging.yml --profile monitoring up -d
```

## PostgreSQL backups

Daily backups via `prodrigestivill/postgres-backup-local`:

```bash
# With main compose (backup profile)
docker compose --profile backup up -d postgres-backup

# Staging overlay includes backup service by default
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d postgres-backup
```

Backups are stored in Docker volume `postgres_backups` (path inside container: `/backups`).

## Monitoring

| Endpoint | Purpose |
|----------|---------|
| `GET /api/actuator/health` | Liveness/readiness (public) |
| `GET /api/actuator/prometheus` | Prometheus scrape (restrict via nginx/network) |
| `GET /api/actuator/info` | Build info |

Prometheus config: `ops/prometheus/prometheus.yml` (used when `--profile monitoring` is enabled).

**Sentry:** not bundled; set `SENTRY_DSN` in your deployment platform and add the SDK if needed.

## Email notifications

Borrow reminders, overdue notices, and reservation availability use `NotificationService`.

| `MAIL_ENABLED` | Behavior |
|----------------|----------|
| `false` (default) | Log-only (`LoggingNotificationService`) |
| `true` + SMTP settings | HTML emails via `EmailNotificationService` |

### SendGrid (SMTP)

```env
MAIL_ENABLED=true
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=SG.your_sendgrid_api_key
MAIL_FROM=verified-sender@yourdomain.com
MAIL_FROM_NAME=Library Management System
MAIL_APP_URL=https://your-frontend.example
```

`MAIL_FROM` must be verified in the SendGrid dashboard. Scheduler runs daily at 09:00 (`BorrowReminderScheduler`).

### Local testing with MailHog

```bash
docker run -d --name mailhog -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

```env
MAIL_ENABLED=true
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM=library@local.test
```

Open http://localhost:8025 to view captured messages.

## HTTPS / nginx

Example config: `ops/nginx/library.conf`

- `/api/*` → Spring Boot (`app:8080`)
- `/` → Next.js (`frontend:3000`)
- `/actuator/*` → restricted to private networks in the sample config

Terminate TLS at nginx or your cloud load balancer; set `APP_CORS_ALLOWED_ORIGINS` to the public HTTPS origin.

## Health checks

| Service | Probe |
|---------|--------|
| PostgreSQL | `pg_isready` |
| Backend | `GET /api/actuator/health/readiness` |
| Frontend | `GET /api/health` (Next.js route, returns `{"status":"UP"}`) |

Correlation ID: send `X-Correlation-Id` on API requests; echoed in response and JSON logs (`correlationId` MDC field).
