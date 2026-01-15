# stack-auth (monorepo)

Landing page + reference auth apps (Core TS + React TS) using Auth0 (SPA) with Authorization Code + PKCE.

## Prereqs
- Node.js 18+
- pnpm 9+

## Auth0 settings (Application: `stack-auth`, type: Single Page Application)
Enable:
- Google social connection
- Database connection (email/password)

Local URLs to add:

### Allowed Callback URLs
- http://localhost:5173/callback
- http://localhost:5174/callback

### Allowed Logout URLs
- http://localhost:5173/
- http://localhost:5174/

### Allowed Web Origins
- http://localhost:5173
- http://localhost:5174

Notes:
- Landing app (port 3000) does not authenticate; it only links to the other apps.
- If you later add more stacks/ports, add the corresponding callback/logout/origin entries.

## Quick start

1) Install deps at repo root:

```bash
pnpm install
```

2) Create env files:

```bash
cp apps/core-ts/.env.example apps/core-ts/.env
cp apps/react-ts/.env.example apps/react-ts/.env
```

Fill in your Auth0 values in both `.env` files.

3) Run all apps:

```bash
pnpm dev
```

Open:
- Landing: http://localhost:3000
- Core TS: http://localhost:5173
- React TS: http://localhost:5174

## How auth works (no backend)
- Login and signup are done via Auth0 Universal Login.
- Google login is a provider button in that hosted login page.
- After login, the app shows a small Home page with user profile + token preview.

## Add a backend later
When you add an API, you typically:
- Configure an Auth0 API (audience)
- Request an access token for that audience
- Validate JWTs server-side and enforce authorization
