# SIDEQUEST Admin

Responsive café-discovery operations dashboard for content, quests, trust and safety, member support, and product analytics.

## Run locally

From `D:\INFORMATION TECHNOLOGY\SIDEQUEST`:

```powershell
npm --prefix packages/shared ci
npm --prefix apps/admin ci
npm run dev
```

Open `http://localhost:3000`. With no environment file, the app intentionally runs in deterministic demo mode.

## Production setup

1. Create a Supabase project and install the Supabase CLI plus Docker Desktop.
2. Copy `apps/admin/.env.example` to `apps/admin/.env.local`.
3. Set `NEXT_PUBLIC_APP_MODE=production`, the project URL, and anonymous key.
4. Run `npx supabase link --project-ref <project-ref>` and `npx supabase db push` from the repository root.
5. Create Supabase Auth users for staff and add matching active rows to `staff_profiles`.
6. Deploy with the same three public variables. Keep the service-role key out of browser and Vercel client variables.

Production requests pass through `proxy.ts`, refresh Supabase sessions, and redirect unauthenticated visitors to `/login`. Database row-level security independently enforces each staff capability.

## Verification

```powershell
npm run test
npm run typecheck
npm run build
npm run e2e
powershell -NoProfile -ExecutionPolicy Bypass -File supabase/tests/schema-contract.test.ps1
```

Database pgTAP tests require Docker Desktop:

```powershell
npx supabase db reset
npx supabase test db supabase/tests/admin_rls.sql
```

## Safety checklist

- Never expose or prefix a service-role key with `NEXT_PUBLIC_`.
- Keep report evidence in a private storage bucket with short-lived signed URLs.
- Invite staff with the lowest role that fits their work.
- Require reasons for moderation, sanctions, XP adjustments, staff-role changes, and entitlement resyncs.
- Preserve `audit_logs` and `xp_ledger` as append-only.
- Review production analytics for data minimization before enabling exports.
- Configure rate limits, CAPTCHA/lockout for repeated sign-in attempts, backups, and alerting before public launch.

## Project map

- `app/` — routes and route states
- `features/` — café, quest, moderation, operations, and analytics modules
- `components/` — reusable shell, tables, cards, forms, and states
- `lib/data/` — demo and Supabase repository adapters
- `../../supabase/` — schema, RLS, seed, and database tests
- `../../docs/` — product/design specification and implementation plan
