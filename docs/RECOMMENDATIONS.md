# HDVL Site Recommendations

## Priority 1: Admin Security and Account Lifecycle

Status: complete.

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

Status: complete.

Events currently store several operational fields as display text. Add structured fields so the public schedule and admin tools can support reliable sorting, filtering, registration state, and event pages.

Recommended fields:

- `start_date`
- `end_date`
- `registration_url`
- `schedule_url`
- `status`
- `division`
- `venue_id`
- `tournament_format`
- `featured`
- `featured_order`

Implementation notes:

- Preserve the original display fields while structured fields are adopted.
- Backfill `start_date`, `end_date`, and `division` from existing event text where possible.
- Use `venue_id` to show venue names and addresses on public event cards.
- Use `tournament_format` to separate 1-day and 2-day tournaments on the public schedule.
- Use `featured` and `featured_order` to spotlight the larger HDVL-hosted events.

## Priority 3: Safer Event and Venue Deletes

Replace browser confirmation dialogs with explicit confirmation modals that show exactly what will be deleted. Consider soft-delete support for recoverable mistakes.

## Priority 4: Registration Improvements

Status: complete.

Add event-specific registration links and calls to action. The public flow should move from schedule card to exact registration action without requiring coaches to infer the next step from the general guide.

Implementation notes:

- Admins can now store `registration_url` per event.
- Admins can now store `schedule_url` per event.
- Public event cards show a direct registration CTA when registration is open and a URL is present.
- Public event cards show a live schedule CTA when a schedule URL is present.

## Priority 5: Event Detail Pages

Create dedicated event pages with dates, divisions, price, venue, registration link, venue rules, and contact details. This improves coach usability and gives the site stronger search/social share targets.

## Priority 6: Link Events to Venues

Status: complete for schedule cards.

Connect events to venue records so event pages and schedule cards can automatically show address, map links, and site-specific rules.

Implementation notes:

- Admins can assign one or more venues to each event.
- Public event cards now show assigned venue names and addresses.
- Event detail pages should use the same relationship once they exist.

## Priority 7: Visual and Mobile Polish

Refine the current dark/blue-heavy presentation into a clearer league operations experience. Focus on mobile density, readable schedule cards, video poster/fallback support, and stronger distinction between public schedule, registration, and venue information.

## Priority 8: SEO and Social Metadata

Add or verify sitemap, robots, canonical URLs, Open Graph image/title/description, and event-specific metadata once event detail pages exist.

## Priority 9: Operations Documentation

Keep setup and production runbooks current for Turso migrations, Vercel env vars, admin account recovery, and deployment verification.
