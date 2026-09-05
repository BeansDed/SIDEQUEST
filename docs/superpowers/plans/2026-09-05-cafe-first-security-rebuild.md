# SIDEQUEST café-first UX + security rebuild

Date: 2026-09-05
Branch: `rebuild/cafe-security-ux`

## Product direction

SIDEQUEST should feel like a real café discovery brand, not an admin product wearing a consumer skin. The public web and mobile app are customer products first. Staff operations are privileged infrastructure and must never be advertised from consumer navigation.

### Visual language

- Espresso, roasted brown, warm tan, oat, cream, paper, muted olive.
- Editorial café photography is the visual anchor. Avoid fake device mockups, generic gradient blobs, glassmorphism, excessive pills, and dashboard-looking consumer cards.
- Use tactile cues sparingly: paper borders, menu-board typography, coffee-label microcopy, warm shadows, and asymmetrical editorial grids.
- Desktop web should be a real responsive website, not a phone UI floating inside a desktop frame.
- Mobile shares the same tokens and content hierarchy but keeps native interaction patterns.

## Public web structure

1. `/` becomes a real customer landing page.
   - Brand hero with real café photography.
   - Vibe/budget/use-case discovery entry points.
   - Nearby/open-now café preview.
   - Customer feature explanations: saved lists, verified café details, sidequests, privacy.
   - No staff/admin links.
2. `/app` becomes the signed-out-capable consumer home.
   - Personal moment selector.
   - Best match + nearby alternatives.
   - Open-now/budget radar.
   - Sidequest picks.
   - Clear entry points to Discover, Saved, Social, Reviews, and Profile.
3. `/app/discover`, café detail, quests, saved collections, social, review, settings and Plus retain functionality but inherit the rebuilt café visual system.

## Staff structure

- Remove every admin link from public UI.
- Keep staff authentication on an unadvertised `/staff/access` route.
- `/login` becomes a consumer-safe redirect and is no longer the staff entry.
- All privileged pages remain protected even when a user manually knows the URL.
- Authentication is not considered authorization: the server must also verify an active `staff_profiles` row and role.

## Security baseline

### Authentication and sessions

- Supabase SSR cookie sessions only for web staff access.
- Server-side sign-in endpoint with schema validation and generic failure responses.
- Same-origin request validation on staff auth mutations.
- Per-IP/email burst throttling in the application plus Supabase Auth provider limits.
- Immediately sign out authenticated users who do not have an active staff profile.
- Production never falls back to demo admin access.
- Demo admin requires an explicit server-only opt-in and is disabled in production.

### Authorization

- Admin layout fails closed: no valid active staff session means redirect to staff access.
- Role/capability checks remain backed by Supabase RLS so bypassing UI controls does not grant database access.
- Privileged writes must be capability checked at the database/service layer, not only hidden in React.

### Browser and transport hardening

- Content Security Policy with restricted frame/object/base/form origins.
- `X-Content-Type-Options: nosniff`.
- `X-Frame-Options: DENY` plus CSP `frame-ancestors 'none'`.
- Strict referrer policy.
- Permissions Policy restricting sensitive browser features.
- Cross-origin opener/resource policies.
- HSTS in production.
- Sensitive staff responses use `Cache-Control: no-store`.
- Staff/admin routes are disallowed from crawler indexing.

### Data and privacy

- RLS remains enabled for privileged/admin tables.
- Never expose service-role credentials to browser code.
- Public clients use only the publishable/anon key.
- Exact user location is opt-in; discovery works with coarse/manual area selection.
- Saved cafés, collections, quest progress and social data default private unless the user explicitly shares.
- Audit privileged actions and security-relevant staff events.

### Abuse and input safety

- Validate server mutation payloads with Zod.
- Bound request sizes and reject malformed JSON.
- Render user text as text, never raw HTML.
- Rate limit authentication and sensitive mutation endpoints.
- Avoid open redirects by allowing only local relative `next` destinations.
- Use generic authentication errors to reduce account enumeration.

## Mobile upgrades

- Rebuild Home around café photography, warm paper surfaces and editorial hierarchy.
- Add moment shortcuts: study, solo reset, date, friends, food.
- Surface open-now and under-budget counts.
- Add nearby alternatives below the primary match.
- Keep native bottom navigation but soften it into the café palette instead of a generic dark floating dock.

## Staff feature upgrades

- Keep existing café/quest/moderation/analytics/staff/audit tools.
- Add a security posture panel to System Health showing auth mode, RLS expectation, protected-route status, and environment configuration health without revealing secrets.
- Add operational reminders for inactive staff review, audit review, and stale café verification.

## Delivery order

1. Fix privileged route boundaries and remove public admin affordances.
2. Add auth mutation endpoint, server authorization guard and headers.
3. Replace `/` with customer landing.
4. Rebuild desktop consumer shell and Home.
5. Update mobile Home/tokens/navigation.
6. Add security health UI and tests.
7. Run typecheck, unit tests, production build and browser smoke tests before merge.

## Definition of done

- No public customer surface links to staff/admin.
- Knowing an admin URL is insufficient to access it.
- Production has no implicit demo-admin bypass.
- Landing page and web app read visually as a café discovery product at desktop and mobile widths.
- Customer Home provides more than a single recommendation and quest card.
- Security headers are visible on production responses.
- Staff auth failures are generic and throttled.
- Existing consumer and admin workflows still build and test successfully.
