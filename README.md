# LE LABS — website + sovereign stack

Public website for **LE LABS** (the R&D lab of P2Enjoy Studio) plus a fully
**sovereign, self-hosted** backend and a one-command Docker stack that also runs
the [back-office](../le-labs-backoffice) admin app.

Everything runs on infrastructure you own — no managed/3rd-party services:

| Concern        | Sovereign component (self-hosted)                     |
| -------------- | ----------------------------------------------------- |
| Database/API   | PostgreSQL + PostgREST (Supabase REST)                |
| Auth           | GoTrue — passwordless **magic-link / OTP** by email   |
| Object storage | Supabase Storage backed by **MinIO** (S3-compatible)  |
| Email (dev)    | **Inbucket** SMTP catch-all + webmail                 |
| API gateway    | nginx (single Supabase origin)                        |

> This is a **lean** Supabase stack (Postgres + Auth + REST + Storage + gateway).
> Studio, Realtime, Analytics, Edge Functions and the connection pooler are not
> included.

## Architecture

```
                 ┌────────────────────────────── Docker network ──────────────────────────────┐
  browser ─▶ website (Vite/nginx) ─┐                                  ┌─ auth     (GoTrue)
  browser ─▶ backoffice (Vite/nginx)┼─ /auth|rest|storage/v1 ─▶ gateway (nginx) ─┼─ rest     (PostgREST)
                                    │   (same-origin proxy)             ├─ storage  (Storage API) ─▶ minio (S3)
                                    │                                  └─ db       (Postgres)
                                    └─ static SPA + JSON content        auth ─▶ inbucket (SMTP, dev)
```

Each app reverse-proxies the Supabase path prefixes (`/auth/v1`, `/rest/v1`,
`/storage/v1`) to the gateway, so `@supabase/supabase-js` talks to Supabase
**same-origin** (no CORS) and the exact same code works whether the browser runs
on your laptop or inside the E2E container.

## Quick start (dev / demo)

Both repos must be cloned side by side (`le-labs-website/` and
`le-labs-backoffice/`). Then, from this repo:

```bash
docker compose --env-file .env.dev \
  -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

| Service        | URL                              |
| -------------- | -------------------------------- |
| Website        | http://localhost:5173            |
| Back-office    | http://localhost:5174            |
| Supabase API   | http://localhost:8000            |
| Inbucket (mail)| http://localhost:9110            |
| MinIO console  | http://localhost:9001 (minioadmin / minioadmin123) |
| Postgres       | localhost:5432 (postgres / your-super-secret-and-long-postgres-password) |

The dev stack is **pre-seeded** with the four example projects that used to be
hard-coded in the app (see `supabase/seed/examples.sql`).

### Signing in to the back-office (dev)

1. Open the back-office, click **Login**, enter any email, **Send sign-in email**.
2. Open **Inbucket** (http://localhost:9110), open the email and either click the
   magic link or paste the 6-digit code back into the modal.

## Production

Prod uses the same sovereign Supabase core but serves both apps as static builds
behind nginx, and points Storage/Auth at **real S3 and SMTP** (no MinIO/Inbucket):

```bash
cp .env.prod.example .env.prod   # then fill in real secrets + S3/SMTP
docker compose --env-file .env.prod \
  -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

| Service     | URL (default)          |
| ----------- | ---------------------- |
| Website     | http://localhost:8080  |
| Back-office | http://localhost:8081  |
| Supabase API| http://localhost:8000  |

Generate fresh `JWT_SECRET`, `ANON_KEY` and `SERVICE_ROLE_KEY` — do **not** ship
the dev demo keys. See `.env.prod.example`.

## Database schema & seed

Migrations live in `supabase/migrations/` and are applied (idempotently) by the
one-shot `bootstrap` service once Postgres + Storage are ready:

- `…_mellow_brook.sql` — `le_labs_project` table + public read + `last_modified` trigger
- `…_authenticated_write_policies.sql` — RLS write policies for the back-office
- `…_storage_project_images.sql` — public `project-images` bucket + storage policies

`supabase/seed/examples.sql` is applied **only in dev** (`SEED_EXAMPLES=true`).

## End-to-end tests (filmed)

A Playwright suite drives the whole sovereign flow and records a video +
per-phase screenshots to `e2e/artifacts/`:

```bash
docker compose --env-file .env.dev \
  -f docker-compose.yml -f docker-compose.dev.yml --profile e2e run --rm e2e
```

It checks: seeded site content → project detail → OTP sign-in (via Inbucket) →
create a project with an image **uploaded to MinIO** → the new project showing
up on the public website.

## Behind a corporate / egress TLS proxy?

Drop the proxy's CA `*.crt` into `docker/extra-cas/` (and `e2e/extra-cas/`) and
rebuild — see `docker/extra-cas/README.md`. Empty by default (no-op).

## Useful commands

```bash
# logs / status
docker compose --env-file .env.dev -f docker-compose.yml -f docker-compose.dev.yml ps
docker compose --env-file .env.dev -f docker-compose.yml -f docker-compose.dev.yml logs -f auth

# tear down (add -v to also wipe the database volume)
docker compose --env-file .env.dev -f docker-compose.yml -f docker-compose.dev.yml down

# lint / typecheck / unit tests
npm run lint && npx tsc -p tsconfig.app.json --noEmit && npm test
```
