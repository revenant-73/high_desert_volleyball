# HDVL Site Recommendations

## Priority 1: Admin Security and Account Lifecycle

Status: in progress.

Recommended work:

- Add super-admin-only account lifecycle controls.
- Support creating, updating, deactivating, reactivating, and deleting admin accounts.
- Let every admin change their own password.
- Let super admins reset another admin's password.
- Prevent removal of the last active super admin.
- Prevent a super admin from deleting or deactivating their own account.
- Rate-limit failed login attempts by email and IP address.
- End sessions for accounts that are deactivated, deleted, or password-reset by a super admin.

## Priority 2: Structured Event Data

Events currently store several operational fields as display text. Add structured fields so the public schedule and admin tools can support reliable sorting, filtering, registration state, and event pages.

Recommended fields:

- `start_date`
- `end_date`
- `registration_url`
- `status`
- `division`
- `venue_id`

## Priority 3: Safer Event and Venue Deletes

Replace browser confirmation dialogs with explicit confirmation modals that show exactly what will be deleted. Consider soft-delete support for recoverable mistakes.

## Priority 4: Registration Improvements

Add event-specific registration links and calls to action. The public flow should move from schedule card to exact registration action without requiring coaches to infer the next step from the general guide.

## Priority 5: Event Detail Pages

Create dedicated event pages with dates, divisions, price, venue, registration link, venue rules, and contact details. This improves coach usability and gives the site stronger search/social share targets.

## Priority 6: Link Events to Venues

Connect events to venue records so event pages and schedule cards can automatically show address, map links, and site-specific rules.

## Priority 7: Visual and Mobile Polish

Refine the current dark/blue-heavy presentation into a clearer league operations experience. Focus on mobile density, readable schedule cards, video poster/fallback support, and stronger distinction between public schedule, registration, and venue information.

## Priority 8: SEO and Social Metadata

Add or verify sitemap, robots, canonical URLs, Open Graph image/title/description, and event-specific metadata once event detail pages exist.

## Priority 9: Operations Documentation

Keep setup and production runbooks current for Turso migrations, Vercel env vars, admin account recovery, and deployment verification.
