# Repository Guidance

This is an Astro site deployed to Vercel.

## Stack

- Astro pages live in `src/pages/`.
- React components live in `src/components/`.
- Shared layouts live in `src/layouts/`.
- Shared server utilities live in `src/lib/`.
- Global styles live in `src/styles/global.css`.
- Static assets live in `public/`.

## Working Rules

- Inspect the existing page/component patterns before editing.
- Keep changes focused and avoid unrelated refactors.
- Preserve public-facing details exactly when supplied by the site owner.
- Do not commit secrets from `.env`.
- Prefer responsive, accessible, low-friction UI for players, parents, coaches, and administrators.

## Verification

Use the existing npm scripts:

```bash
npm run build
npm run dev
npm run preview
```

Run the narrowest useful verification for the change, and do not claim a flow works unless it was actually tested.
