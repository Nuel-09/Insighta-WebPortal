# Insighta Web Portal

Vite + React portal for **Stage 3 (TRD)**: GitHub login, HTTP-only auth cookies, CSRF, and the same profile APIs as the CLI.

## Setup

```bash
cd stage3_webportal
cp .env.example .env
# set VITE_API_URL to your backend, e.g. http://localhost:3000
npm install
npm run dev
```

Backend must allow this origin: set `WEB_ORIGIN` to the dev server (e.g. `http://localhost:5173`) and set `OAUTH_SUCCESS_REDIRECT` to the same after-login URL (e.g. `http://localhost:5173/`).

## Required pages (TRD)

- **Login** — “Continue with GitHub” → `GET {VITE_API_URL}/auth/github` (full redirect; no tokens in JS).
- **Dashboard** — basic metrics from `GET /api/profiles?page=1&limit=1` (`total`, `total_pages`).
- **Profiles** — filter + paginated list; admin can delete from detail.
- **Profile detail** — full JSON; admin **Delete** (CSRF + `DELETE /api/profiles/:id`).
- **Search** — `GET /api/profiles/search?q=...`
- **Account** — user info from session; token refresh action (cookie session).

## HTTP-only cookies & CSRF

- Access/refresh tokens are **not** exposed to JavaScript.
- After load, the app calls `GET /auth/csrf-token` and sends `X-CSRF-Token` on `POST` / `DELETE` (and refresh/logout) so cookie-based requests are **CSRF-protected** per TRD.

## Build / CI

```bash
npm run lint
npm run build
```

## Conventional commits

Use `type(scope): message` (e.g. `fix(portal): handle pagination links`).
