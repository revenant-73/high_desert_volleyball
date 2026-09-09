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

Create or update an admin account by setting `ADMIN_EMAIL`, `ADMIN_ACCOUNT_PASSWORD`, and optionally `ADMIN_NAME` in `.env`, then run:

```bash
npm run admin:upsert
```
