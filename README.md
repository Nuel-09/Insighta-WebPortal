# Insighta Web Portal

Vite + React portal for **Stage 3 (TRD)**: GitHub login, HTTP-only auth cookies, CSRF, and the same profile APIs as the CLI.

**Repository:** https://github.com/Nuel-09/Insighta-WebPortal  

**Live site (Railway):** https://insighta-webportal-production.up.railway.app  

**Backend API used in production:** https://hngstage-0-production.up.railway.app  

## Local development

```bash
git clone https://github.com/Nuel-09/Insighta-WebPortal.git
cd Insighta-WebPortal
cp .env.example .env
```

Edit `.env` so `VITE_API_URL` points at your API **origin only** (no path):

```env
VITE_API_URL=http://localhost:3000
```

Then:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The backend must list this origin in `WEB_ORIGIN` and set `OAUTH_SUCCESS_REDIRECT` to `http://localhost:5173/` (or your dev URL).

## Production build (same vars as Railway)

`VITE_*` variables are baked in at **build** time. For Railway, set in the service:

```env
VITE_API_URL=https://hngstage-0-production.up.railway.app
```

Build and preview locally:

```bash
npm install
npm run build
npm run preview
```

Railway typical settings: **Build** `npm install && npm run build` · **Start** `npx vite preview --host 0.0.0.0 --port $PORT` (or fixed port matching generated domain). See `vite.config.js` for `preview.allowedHosts` if you see “Blocked request” on your Railway hostname.

## Required pages (TRD)

- **Login** — “Continue with GitHub” → browser navigates to `{VITE_API_URL}/auth/github` (full redirect; no tokens in JS).
- **Dashboard** — basic metrics from `GET /api/profiles?page=1&limit=1` (`total`, `total_pages`).
- **Profiles** — filter + paginated list; admin can delete from detail.
- **Profile detail** — full JSON; admin **Delete** (CSRF + `DELETE /api/profiles/:id`).
- **Search** — `GET /api/profiles/search?q=...`
- **Account** — user info from session; token refresh action (cookie session).

## HTTP-only cookies & CSRF

- Access/refresh tokens are **not** exposed to JavaScript.
- After authenticated responses, the app uses `GET /auth/csrf-token` and sends `X-CSRF-Token` on `POST` / `DELETE` (and refresh/logout) for cookie-based CSRF protection.

Backend must allow this portal origin in **`WEB_ORIGIN`** and use **`SameSite=None`** session cookies when portal and API are on different hosts (see backend README).

## Run / test / CI

```bash
npm install
npm run lint
npm run build
npm test
```

- `npm test` runs `npm run build` (production bundle check).  
- **GitHub Actions:** lint + build on push/PR to `main` (`.github/workflows/ci.yml`).

## Related repos

| Repo | URL |
|------|-----|
| Backend | https://github.com/Nuel-09/HNG_STAGE-1 |
| CLI | https://github.com/Nuel-09/Insighta-Cli |

## Conventional commits

Use `type(scope): message` (e.g. `fix(portal): handle pagination links`).
