# High Desert Volleyball

Public website for Rise Volleyball Academy in Boise, Idaho.

The site is built with [Astro](https://astro.build/), React components, Tailwind CSS, and the Astro Vercel adapter. It is deployed on Vercel for public viewing.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Build the production output:

```bash
npm run build
```

Preview a production build locally:

```bash
npm run preview
```

## Project Structure

- `src/pages/` contains Astro pages and API routes.
- `src/components/` contains shared React and Astro UI components.
- `src/layouts/` contains page layouts.
- `src/lib/` contains shared server-side utilities.
- `src/styles/` contains global CSS.
- `public/` contains static assets served directly.

## Environment

Copy `.env.example` to `.env` for local development and fill in the required values.

Do not commit real secrets from `.env`.

## Admin Accounts

Admin access uses email/password accounts stored in Turso. Passwords are hashed before storage, and active sessions are stored as hashed tokens.

Apply the auth tables:

```bash
npm run db:migrate:auth
```

Apply event schedule fields:

```bash
npm run db:migrate:events
```

Create or update an admin account by setting `ADMIN_EMAIL`, `ADMIN_ACCOUNT_PASSWORD`, and optionally `ADMIN_NAME` in `.env`, then run:

```bash
npm run admin:upsert
```

Optional admin account variables:

- `ADMIN_ROLE=admin`
- `ADMIN_ROLE=super_admin`

Super admins can manage admin accounts from `/admin/admins`. The admin tools support creating accounts, resetting passwords, deactivating/reactivating accounts, and deleting accounts. Each admin can change their own password from `/admin/password`.

The migration is additive and idempotent. It creates the auth/session/login-attempt tables, adds admin lifecycle columns when missing, and keeps Loren and Steve marked as active super admins.

## Recommendations

Current improvement recommendations are tracked in [docs/RECOMMENDATIONS.md](docs/RECOMMENDATIONS.md).
