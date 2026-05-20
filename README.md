# Library Management System

Production-ready REST API for managing a library: user authentication, book catalog, borrowing workflow, admin panel, and search.

## Project Overview

The Library Management System is a backend service that allows:

- **Users** to register, log in, browse and search books, borrow and return books
- **Admins** to manage books (CRUD), view users, borrow records, and system statistics

The API is stateless and secured with **JWT**. All responses use DTOs and a unified error format.

## Tech Stack

| Technology | Version |
|------------|---------|
| Java | 21 |
| Spring Boot | 3.3.5 |
| Spring Security | JWT |
| Spring Data JPA | — |
| PostgreSQL | 16 |
| Maven | 3.9+ |
| springdoc-openapi | Swagger UI |
| Docker & Docker Compose | — |
| JUnit 5 & Mockito | Testing |

## Architecture

```
com.library.management
├── config          # OpenAPI, JWT properties
├── controller      # REST endpoints
├── dto             # Request/response DTOs
├── entity          # JPA entities
├── repository      # Spring Data JPA
├── service         # Business logic
├── security        # JWT filter, UserDetailsService
├── exception       # Global error handling
└── mapper          # Entity ↔ DTO mapping
```

## Prerequisites

- **Java 21** (local development)
- **Maven 3.9+** (local development)
- **Docker** & **Docker Compose** (recommended for deployment)

## Standard local setup (one scenario)

Use **only these ports** so CORS, proxy, and docs stay aligned:

| Service | URL | Config |
|---------|-----|--------|
| **Frontend** | http://localhost:3000 | `frontend/.env.local`, `npm run dev` (fixed port `-p 3000`) |
| **Backend API** | http://localhost:8080/api | root `.env` → `APP_PORT=8080` |

### 1. Copy environment files

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```

Copy `.env.example` → `.env` and fill **empty** `DB_PASSWORD` / `JWT_SECRET` with strong random values (see checklist in `.env.example`). Never use placeholder text in production.

`frontend/.env.local` for daily dev (already correct in `.env.example`):

```env
NEXT_PUBLIC_API_URL=/api
API_PROXY_TARGET=http://localhost:8080
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

The browser talks to `http://localhost:3000/api/...`; Next.js proxies to the backend — **no CORS** and no hardcoded API port in the browser bundle.

### 2. Start backend (Docker)

```bash
docker compose up -d postgres app
```

Wait until healthy: http://localhost:8080/api/actuator/health

### 3. Start frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** only (do not use auto-picked ports 3001/3002/3003).

### Troubleshooting

| Problem | Fix |
|---------|-----|
| Port **8080** busy | Stop the other process, or set `APP_PORT=8081` in `.env` **and** `API_PROXY_TARGET=http://localhost:8081` in `frontend/.env.local` |
| Port **3000** busy | Stop other Next.js apps, or run `npx next dev -p 3001` and add `http://localhost:3001` to `APP_CORS_ALLOWED_ORIGINS` in `.env` |
| «Unable to reach server» | Backend not running, or `API_PROXY_TARGET` does not match `APP_PORT` |
| Old webpack chunks | `cd frontend && npm run clean && npm run dev`, then Ctrl+Shift+R in the browser |

---

## Quick Start with Docker (full stack)

### 1. Configure environment

```bash
cp .env.example .env
```

Edit `.env` — replace empty secret fields from `.env.example` (never commit `.env`):

```env
DB_PASSWORD=<openssl rand -base64 24>
JWT_SECRET=<openssl rand -hex 32>
AUTH_EXPOSE_RESET_TOKEN=false
```

### 2. Start the stack

```bash
docker-compose up --build
```

### 3. Verify

| Check | URL |
|-------|-----|
| **Frontend** | http://localhost:3000 |
| Health (readiness) | http://localhost:8080/api/actuator/health/readiness |
| Health (liveness) | http://localhost:8080/api/actuator/health/liveness |
| Swagger UI (dev only) | Disabled in `prod` profile |

See [frontend/README.md](frontend/README.md) for frontend setup, Docker, SEO, and PWA details.

### 4. Stop

```bash
docker-compose down
```

To remove database volume:

```bash
docker-compose down -v
```

## Local Development (without Docker)

### 1. Start PostgreSQL

Create database `library_db` and ensure credentials match your environment.

### 2. Run the application

```bash
export SPRING_PROFILES_ACTIVE=dev
export DB_URL=jdbc:postgresql://localhost:5432/library_db
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export JWT_SECRET=local-dev-secret-key-minimum-32-chars-long

mvn spring-boot:run
```

### 3. Swagger UI (dev profile)

http://localhost:8080/api/swagger-ui.html

## Environment Variables

| Variable | Required (prod) | Description |
|----------|-----------------|-------------|
| `SPRING_PROFILES_ACTIVE` | Yes | `dev`, `test`, or `prod` |
| `DB_URL` | Yes | JDBC URL, e.g. `jdbc:postgresql://postgres:5432/library_db` |
| `DB_USERNAME` | Yes | Database username |
| `DB_PASSWORD` | Yes | Database password |
| `JWT_SECRET` | Yes | HMAC secret (min. 32 characters) |
| `JWT_EXPIRATION_MS` | No | Token TTL in ms (default: 86400000) |
| `SERVER_PORT` | No | HTTP port (default: 8080) |
| `APP_PORT` | No | Host port mapping in Docker Compose |

No secrets are hardcoded in production configuration.

## Database migrations (Flyway)

Schema is versioned under `src/main/resources/db/migration/` (e.g. `V1__init_schema.sql`).

| Profile | Flyway | Hibernate `ddl-auto` |
|---------|--------|----------------------|
| `dev` / `prod` | Enabled — applies pending migrations on startup | `validate` (schema must match entities) |
| `test` | Disabled | `create-drop` (H2 in-memory) |

**New database:** Flyway runs `V1` and creates tables.

**Existing database** (already created with older `ddl-auto: update`): `baseline-on-migrate` marks version 1 as applied without re-running `V1`.

**Add a change:** create `V2__description.sql`, never edit applied migrations.

```bash
# Example: add a column in a new migration file
# src/main/resources/db/migration/V2__add_user_display_name.sql
```

## Spring Profiles

| Profile | Purpose |
|---------|---------|
| `dev` | Local development, debug logging, Swagger enabled |
| `test` | H2 in-memory database for tests |
| `prod` | Production/Docker: env-based config, structured logging, Swagger disabled |

Activate a profile:

```bash
export SPRING_PROFILES_ACTIVE=prod
```

## Production Build

```bash
mvn clean package -Pprod -DskipTests
```

Docker build uses layered JAR optimization via Spring Boot Maven plugin.

```bash
mvn clean package -Pdocker -DskipTests
docker build -t library-management-system .
```

## API Documentation

### Base URL

```
http://localhost:8080/api
```

### Swagger (development)

When running with `dev` profile:

- **Swagger UI:** `/api/swagger-ui.html`
- **OpenAPI JSON:** `/api/v3/api-docs`

### Main Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register user |
| POST | `/auth/login` | Public | Login |
| GET | `/books` | USER, ADMIN | List books (paginated) |
| GET | `/books/search` | USER, ADMIN | Search books |
| GET | `/books/{id}` | USER, ADMIN | Get book |
| POST | `/books` | ADMIN | Create book |
| PUT | `/books/{id}` | ADMIN | Update book |
| DELETE | `/books/{id}` | ADMIN | Delete book |
| POST | `/borrow` | Authenticated | Borrow book |
| POST | `/return/{borrowId}` | Authenticated | Return book |
| GET | `/borrow/my` | Authenticated | My borrows |
| GET | `/admin/users` | ADMIN | All users |
| GET | `/admin/borrowed-books` | ADMIN | All borrow records |
| GET | `/admin/statistics` | ADMIN | System stats |

### Health Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/actuator/health` | Overall health |
| `/api/actuator/health/liveness` | Liveness probe |
| `/api/actuator/health/readiness` | Readiness probe |

## Authentication Flow

```
┌──────────┐     POST /auth/register      ┌─────────────┐
│  Client  │ ───────────────────────────► │   API       │
└──────────┘                                │  (BCrypt)   │
       │                                    └──────┬──────┘
       │     POST /auth/login                      │
       │ ─────────────────────────────────────────►│
       │                                           │
       │◄──────────────── JWT token ───────────────┘
       │
       │     Authorization: Bearer <token>
       ▼
┌──────────────┐     JwtAuthenticationFilter     ┌──────────────┐
│  Protected   │ ───────────────────────────────► │ SecurityContext│
│  endpoints   │                                   └──────────────┘
└──────────────┘
```

### 1. Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "USER",
  "username": "john_doe"
}
```

### 2. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Access protected resources

```http
GET /api/books
Authorization: Bearer <token>
```

### 4. Admin access

Promote a user to admin in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

## Error Response Format

All errors return a consistent JSON body:

```json
{
  "timestamp": "2026-05-20T12:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Book not found with id: 1",
  "path": "/api/books/1",
  "errors": [
    { "field": "title", "message": "Title is required" }
  ]
}
```

| Status | Meaning |
|--------|---------|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict |
| 500 | Internal server error |

## Testing

```bash
mvn test
```

- **Unit tests:** `AuthService`, `BookService`, `BorrowService`
- **Integration tests:** Auth and Books endpoints (MockMvc + H2)

Run backend tests locally:

```bash
mvn test
```

Or without Maven installed:

```bash
docker run --rm -v "%cd%:/app" -w /app maven:3.9.9-eclipse-temurin-21-alpine mvn -B test
```

## Continuous Integration

GitHub Actions workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on push/PR:

| Job | Steps |
|-----|--------|
| **backend** | H2 unit/integration tests + `mvn package -DskipTests` |
| **backend-postgres** | Testcontainers PostgreSQL (search, pagination, filters) |
| **openapi** | Exports `target/openapi/openapi.json` (prod keeps Swagger off) |
| **frontend** | `npm ci` → lint → typecheck → `npm test` → `npm run build` |

Docker image builds still skip tests via the `docker` Maven profile (fast images); CI validates tests separately.

See [docs/OPERATIONS.md](docs/OPERATIONS.md) for staging, backups, Prometheus, nginx, and health checks.

## Docker Services

| Service | Image / Build | Port |
|---------|---------------|------|
| `postgres` | postgres:16-alpine | 5432 (internal) |
| `app` | Dockerfile | 8080 |
| `frontend` | `frontend/Dockerfile` | 3000 |
| `postgres-backup` | prodrigestivill/postgres-backup-local | — (`--profile backup`) |

The application waits for PostgreSQL to become healthy before starting. Frontend health: `GET /api/health`.

## Security Notes

- Change default passwords and `JWT_SECRET` before deployment
- Store secrets in environment variables or a secret manager
- Swagger is disabled in the `prod` profile
- Use HTTPS behind a reverse proxy in real production
- Schema changes go through **Flyway** (`src/main/resources/db/migration/`); Hibernate uses `ddl-auto: validate` in dev/prod (no automatic DDL in production)

## License

This project is provided for educational and demonstration purposes.
