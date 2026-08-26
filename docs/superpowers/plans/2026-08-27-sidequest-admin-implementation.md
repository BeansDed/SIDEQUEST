# SIDEQUEST Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, responsive SIDEQUEST admin dashboard with role-aware navigation, complete operational modules, a Supabase-ready data layer, seeded capstone data, and automated verification.

**Architecture:** A Next.js application in `apps/admin` consumes focused feature services and shared role/validation utilities from `packages/shared`. Supabase migrations define the production schema, RLS, audit trail, and seed data; the UI can run in deterministic demo mode without credentials and switches to Supabase through the same repository interfaces when environment variables are present.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Zod, Supabase, Vitest, Testing Library, Playwright, Lucide icons.

**Spec:** `docs/superpowers/specs/2026-08-27-sidequest-admin-design.md`

## Global Constraints

- Separate responsive web admin from the reserved Expo consumer application.
- Use oat canvas, paper cards, espresso actions, crema borders, sage statuses, and restrained lavender highlights.
- Enforce Super Admin, Content Admin, Moderator, and Analyst capabilities in both UI and server/data boundaries.
- Never expose a Supabase service-role key to the browser.
- Use soft deletion or archival for referenced domain records.
- Require reasons and append-only audit entries for sensitive actions.
- Include loading, empty, error, permission-denied, and stale-data states.
- Maintain keyboard operation, accessible labels, visible focus, contrast, and reduced-motion support.
- Ship deterministic seed data so every major module works without production credentials.

---

## File Structure

```text
apps/admin/
  app/                         routes, layouts, loading/error states
  components/                  reusable navigation, tables, cards, forms
  features/                    module-specific views and repositories
  lib/                         auth, data provider, formatting, analytics
  tests/                       integration and accessibility tests
  e2e/                         Playwright user journeys
packages/shared/src/
  roles.ts                     capabilities and permission checks
  schemas.ts                   Zod domain validation
  domain.ts                    shared TypeScript domain types
supabase/migrations/
  0001_admin_core.sql          tables, indexes, triggers, audit helpers
  0002_admin_rls.sql           role and row-level security policies
supabase/seed.sql              deterministic demo records
```

### Task 1: Workspace and Café-Themed Application Shell

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `apps/admin/package.json`
- Create: `apps/admin/app/layout.tsx`
- Create: `apps/admin/app/page.tsx`
- Create: `apps/admin/app/globals.css`
- Create: `apps/admin/components/layout/admin-shell.tsx`
- Create: `apps/admin/components/layout/sidebar.tsx`
- Create: `apps/admin/components/layout/topbar.tsx`
- Create: `apps/admin/vitest.config.ts`
- Test: `apps/admin/tests/admin-shell.test.tsx`

**Interfaces:**
- Consumes: none.
- Produces: `AdminShell({ children }: { children: React.ReactNode })`, café-theme CSS variables, workspace commands `dev`, `build`, `test`, and `typecheck`.

- [ ] **Step 1: Write the shell test**

```tsx
it("renders the core admin landmarks", () => {
  render(<AdminShell><div>Dashboard content</div></AdminShell>);
  expect(screen.getByRole("navigation", { name: /admin navigation/i })).toBeVisible();
  expect(screen.getByRole("banner")).toBeVisible();
  expect(screen.getByRole("main")).toHaveTextContent("Dashboard content");
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `pnpm --filter @sidequest/admin test -- admin-shell.test.tsx`  
Expected: FAIL because the application and `AdminShell` do not exist.

- [ ] **Step 3: Scaffold the workspace and implement the shell**

Create the workspace packages, Next.js configuration, TypeScript configuration, test setup, café design tokens, responsive sidebar, top bar, skip link, mobile navigation trigger, and main-content landmark. The default `/` route redirects to `/overview`.

- [ ] **Step 4: Run shell verification**

Run: `pnpm --filter @sidequest/admin test -- admin-shell.test.tsx && pnpm --filter @sidequest/admin typecheck`  
Expected: PASS and zero TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml apps/admin
git commit -m "feat: scaffold SIDEQUEST admin shell"
```

### Task 2: Shared Roles, Capabilities, and Domain Validation

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/src/roles.ts`
- Create: `packages/shared/src/domain.ts`
- Create: `packages/shared/src/schemas.ts`
- Test: `packages/shared/src/roles.test.ts`
- Test: `packages/shared/src/schemas.test.ts`

**Interfaces:**
- Consumes: none.
- Produces: `StaffRole`, `Capability`, `ROLE_CAPABILITIES`, `can(role, capability)`, `CafeSchema`, `QuestSchema`, `ModerationResolutionSchema`, and shared domain types.

- [ ] **Step 1: Write permission and validation tests**

```ts
expect(can("analyst", "cafe:update")).toBe(false);
expect(can("content_admin", "cafe:update")).toBe(true);
expect(can("moderator", "report:resolve")).toBe(true);
expect(ModerationResolutionSchema.safeParse({ outcome: "hide", reason: "" }).success).toBe(false);
expect(CafeSchema.safeParse(validCafeFixture).success).toBe(true);
```

- [ ] **Step 2: Run tests and verify failure**

Run: `pnpm --filter @sidequest/shared test`  
Expected: FAIL because exports are not implemented.

- [ ] **Step 3: Implement capabilities and schemas**

Define explicit capability strings for dashboard, café, quest, taxonomy, moderation, user sanctions, announcements, subscriptions, analytics, staff, audit, and health. Implement pure permission checks and Zod schemas with publish-time café and quest refinements.

- [ ] **Step 4: Run shared verification**

Run: `pnpm --filter @sidequest/shared test && pnpm --filter @sidequest/shared typecheck`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/shared
git commit -m "feat: add admin roles and domain validation"
```

### Task 3: Supabase Schema, RLS, Audit, and Seed Data

**Files:**
- Create: `supabase/config.toml`
- Create: `supabase/migrations/0001_admin_core.sql`
- Create: `supabase/migrations/0002_admin_rls.sql`
- Create: `supabase/seed.sql`
- Create: `supabase/tests/admin_rls.sql`

**Interfaces:**
- Consumes: role names and domain states from Task 2.
- Produces: database tables described in the spec, `staff_has_capability(text)`, `write_audit_log(...)`, append-only `audit_logs` and `xp_ledger`, and seeded demo identities/content.

- [ ] **Step 1: Write database policy assertions**

```sql
select is(
  public.staff_has_capability('cafe:update'),
  false,
  'analyst cannot update cafés'
);
select throws_ok(
  $$ delete from public.audit_logs $$,
  'audit logs are append-only'
);
```

- [ ] **Step 2: Run the database test and verify failure**

Run: `supabase db reset && supabase test db supabase/tests/admin_rls.sql`  
Expected: FAIL because migrations do not exist.

- [ ] **Step 3: Implement the core schema**

Create staff, café, branch, hours, photo, taxonomy, quest/version/objective, participation, review, collection, achievement, XP, report, moderation, appeal, announcement, entitlement, analytics, and audit tables. Add foreign keys, check constraints, spatial-ready latitude/longitude constraints, publication/version metadata, archival fields, and indexes for admin filters.

- [ ] **Step 4: Implement RLS and audit triggers**

Enable RLS on every table, deny by default, add capability-aware staff policies, protect private report evidence, prevent audit/ledger mutation, and write audit entries for publication, moderation, sanctions, staff roles, and entitlement synchronization.

- [ ] **Step 5: Add deterministic seed data and verify**

Seed four staff roles, eight cafés, branches/hours/tags, six quests, reviews, reports in each state, users, achievements, announcements, and entitlements. Run: `supabase db reset && supabase test db supabase/tests/admin_rls.sql`. Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add supabase
git commit -m "feat: add Supabase admin schema and policies"
```

### Task 4: Data Provider, Demo Repository, and Role-Aware Navigation

**Files:**
- Create: `apps/admin/lib/data/types.ts`
- Create: `apps/admin/lib/data/provider.ts`
- Create: `apps/admin/lib/data/demo-repository.ts`
- Create: `apps/admin/lib/data/supabase-repository.ts`
- Create: `apps/admin/lib/auth/session.ts`
- Create: `apps/admin/components/auth/role-switcher.tsx`
- Modify: `apps/admin/components/layout/sidebar.tsx`
- Test: `apps/admin/tests/navigation-permissions.test.tsx`

**Interfaces:**
- Consumes: `StaffRole`, `Capability`, and domain types from Task 2.
- Produces: `AdminRepository` with typed query/mutation methods, `getAdminRepository()`, `getDemoSession()`, and capability-filtered `NAV_ITEMS`.

- [ ] **Step 1: Write the navigation boundary test**

```tsx
render(<Sidebar role="analyst" />);
expect(screen.getByText("Analytics")).toBeVisible();
expect(screen.queryByText("Staff")).not.toBeInTheDocument();
expect(screen.queryByText("Moderation")).not.toBeInTheDocument();
```

- [ ] **Step 2: Run and verify failure**

Run: `pnpm --filter @sidequest/admin test -- navigation-permissions.test.tsx`  
Expected: FAIL because role-aware navigation is missing.

- [ ] **Step 3: Implement repositories and navigation**

Define a single repository contract for dashboard metrics, cafés, quests, reports, users, taxonomy, achievements, announcements, entitlements, audit, and health. Implement deterministic in-memory demo results and a Supabase adapter selected only when public URL and anonymous key are configured. Add an obvious demo-role switcher that never appears in production mode.

- [ ] **Step 4: Verify**

Run: `pnpm --filter @sidequest/admin test -- navigation-permissions.test.tsx && pnpm --filter @sidequest/admin typecheck`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/admin/lib apps/admin/components
git commit -m "feat: add admin data provider and permissions"
```

### Task 5: Overview, Analytics Cards, and Operational States

**Files:**
- Create: `apps/admin/app/overview/page.tsx`
- Create: `apps/admin/features/overview/overview-dashboard.tsx`
- Create: `apps/admin/components/data/metric-card.tsx`
- Create: `apps/admin/components/data/status-card.tsx`
- Create: `apps/admin/components/states/content-state.tsx`
- Test: `apps/admin/tests/overview.test.tsx`

**Interfaces:**
- Consumes: `AdminRepository.getOverview(range)` from Task 4.
- Produces: `OverviewDashboard`, reusable `MetricCard`, and `ContentState` variants `loading | empty | error | denied | stale`.

- [ ] **Step 1: Write the overview test**

```tsx
render(<OverviewDashboard data={demoOverview} />);
expect(screen.getByRole("heading", { name: /good afternoon/i })).toBeVisible();
expect(screen.getByText("Open reports")).toBeVisible();
expect(screen.getByText("Café data quality")).toBeVisible();
```

- [ ] **Step 2: Run and verify failure**

Run: `pnpm --filter @sidequest/admin test -- overview.test.tsx`  
Expected: FAIL because the dashboard is absent.

- [ ] **Step 3: Implement the dashboard and states**

Build responsive metrics, trend visualization using accessible CSS/SVG, moderation summary, data-quality queue, recent activity, date-range control, quick actions, skeletons, stale-data banner, and repository error state.

- [ ] **Step 4: Verify**

Run: `pnpm --filter @sidequest/admin test -- overview.test.tsx`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/admin/app/overview apps/admin/features/overview apps/admin/components
git commit -m "feat: build admin overview dashboard"
```

### Task 6: Café, Branch, Taxonomy, and Featured Content Operations

**Files:**
- Create: `apps/admin/app/cafes/page.tsx`
- Create: `apps/admin/app/cafes/[id]/page.tsx`
- Create: `apps/admin/app/taxonomy/page.tsx`
- Create: `apps/admin/app/featured/page.tsx`
- Create: `apps/admin/features/cafes/cafe-table.tsx`
- Create: `apps/admin/features/cafes/cafe-editor.tsx`
- Create: `apps/admin/features/cafes/completeness.ts`
- Create: `apps/admin/features/taxonomy/taxonomy-manager.tsx`
- Create: `apps/admin/features/featured/featured-manager.tsx`
- Test: `apps/admin/tests/cafe-operations.test.tsx`
- Test: `apps/admin/features/cafes/completeness.test.ts`

**Interfaces:**
- Consumes: café schemas and repository methods from Tasks 2 and 4.
- Produces: `calculateCafeCompleteness(cafe): CompletenessResult`, café list/editor, taxonomy manager, featured placement manager, archive/restore actions.

- [ ] **Step 1: Write completeness and editor tests**

```ts
expect(calculateCafeCompleteness(incompleteCafe).blocking).toContain("approvedPhoto");
expect(calculateCafeCompleteness(completeCafe).score).toBe(100);
```

```tsx
render(<CafeEditor cafe={completeCafe} permissions={contentAdminPermissions} />);
expect(screen.getByRole("button", { name: /publish café/i })).toBeEnabled();
```

- [ ] **Step 2: Run and verify failure**

Run: `pnpm --filter @sidequest/admin test -- cafe-operations.test.tsx completeness.test.ts`  
Expected: FAIL.

- [ ] **Step 3: Implement operations**

Build URL-synchronized filters, sortable table, completeness indicators, identity/branch/hours/vibe/amenity/photo form sections, preview panel, publish/archive confirmations, taxonomy ordering/archive behavior, and scheduled featured placements. Mutations show pending, success, conflict, validation, and denied states.

- [ ] **Step 4: Verify**

Run: `pnpm --filter @sidequest/admin test -- cafe-operations.test.tsx completeness.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/admin/app/cafes apps/admin/app/taxonomy apps/admin/app/featured apps/admin/features
git commit -m "feat: add café content operations"
```

### Task 7: Quest, Achievement, and XP Operations

**Files:**
- Create: `apps/admin/app/quests/page.tsx`
- Create: `apps/admin/app/quests/[id]/page.tsx`
- Create: `apps/admin/app/achievements/page.tsx`
- Create: `apps/admin/features/quests/quest-builder.tsx`
- Create: `apps/admin/features/quests/quest-preview.tsx`
- Create: `apps/admin/features/achievements/achievement-manager.tsx`
- Test: `apps/admin/tests/quest-builder.test.tsx`

**Interfaces:**
- Consumes: `QuestSchema`, quest repository, and capabilities.
- Produces: draft/schedule/publish/version/pause/archive flows and achievement rule editor.

- [ ] **Step 1: Write the quest validation test**

```tsx
render(<QuestBuilder quest={draftWithoutSafetyCopy} />);
await user.click(screen.getByRole("button", { name: /publish quest/i }));
expect(screen.getByText(/safety message is required/i)).toBeVisible();
```

- [ ] **Step 2: Run and verify failure**

Run: `pnpm --filter @sidequest/admin test -- quest-builder.test.tsx`  
Expected: FAIL.

- [ ] **Step 3: Implement quest and achievement operations**

Add objective ordering, XP/duration constraints, rare conditions, proof rules, eligibility, schedules, mobile preview, immutable active-version behavior, performance summary, achievement thresholds, and append-only XP adjustment dialog with a required reason.

- [ ] **Step 4: Verify and commit**

Run: `pnpm --filter @sidequest/admin test -- quest-builder.test.tsx`. Expected: PASS.

```bash
git add apps/admin/app/quests apps/admin/app/achievements apps/admin/features
git commit -m "feat: add quest and achievement operations"
```

### Task 8: Moderation, Reports, Appeals, and User Safety

**Files:**
- Create: `apps/admin/app/moderation/page.tsx`
- Create: `apps/admin/app/moderation/[id]/page.tsx`
- Create: `apps/admin/app/users/page.tsx`
- Create: `apps/admin/features/moderation/report-queue.tsx`
- Create: `apps/admin/features/moderation/report-detail.tsx`
- Create: `apps/admin/features/users/user-detail.tsx`
- Create: `apps/admin/features/moderation/resolve-report.ts`
- Test: `apps/admin/tests/moderation.test.tsx`
- Test: `apps/admin/features/moderation/resolve-report.test.ts`

**Interfaces:**
- Consumes: moderation schema, capabilities, repository transaction method.
- Produces: `resolveReport(input): Promise<ResolutionResult>` that atomically updates report/content/account state and appends an audit event.

- [ ] **Step 1: Write resolution tests**

```ts
await expect(resolveReport({ reportId: "r1", outcome: "hide", reason: "" }))
  .rejects.toThrow("Resolution reason is required");
expect(await resolveReport(validResolution)).toMatchObject({ status: "actioned", audited: true });
```

- [ ] **Step 2: Run and verify failure**

Run: `pnpm --filter @sidequest/admin test -- moderation.test.tsx resolve-report.test.ts`  
Expected: FAIL.

- [ ] **Step 3: Implement moderation and user safety**

Build prioritized/assigned queues, report history, minimum private evidence, append-only notes, hide/restore/warn/escalate/dismiss actions, appeal workflow, account warning/suspension/ban controls, anonymization-request display, capability guards, confirmation dialogs, and audit receipts.

- [ ] **Step 4: Verify and commit**

Run: `pnpm --filter @sidequest/admin test -- moderation.test.tsx resolve-report.test.ts`. Expected: PASS.

```bash
git add apps/admin/app/moderation apps/admin/app/users apps/admin/features
git commit -m "feat: add moderation and user safety workflows"
```

### Task 9: Announcements, Subscriptions, Staff, Audit, and System Health

**Files:**
- Create: `apps/admin/app/announcements/page.tsx`
- Create: `apps/admin/app/subscriptions/page.tsx`
- Create: `apps/admin/app/staff/page.tsx`
- Create: `apps/admin/app/audit/page.tsx`
- Create: `apps/admin/app/health/page.tsx`
- Create: `apps/admin/features/announcements/campaign-editor.tsx`
- Create: `apps/admin/features/subscriptions/entitlement-view.tsx`
- Create: `apps/admin/features/staff/staff-manager.tsx`
- Create: `apps/admin/features/audit/audit-table.tsx`
- Create: `apps/admin/features/health/health-dashboard.tsx`
- Test: `apps/admin/tests/operations.test.tsx`

**Interfaces:**
- Consumes: capability checks and operational repository methods.
- Produces: campaign preview/schedule, read-only entitlements with resync, staff role management, immutable audit viewer, and health indicators.

- [ ] **Step 1: Write operations boundary tests**

```tsx
render(<StaffManager role="content_admin" staff={demoStaff} />);
expect(screen.queryByRole("button", { name: /change role/i })).not.toBeInTheDocument();
render(<EntitlementView entitlement={demoEntitlement} />);
expect(screen.queryByRole("button", { name: /refund/i })).not.toBeInTheDocument();
```

- [ ] **Step 2: Run and verify failure**

Run: `pnpm --filter @sidequest/admin test -- operations.test.tsx`  
Expected: FAIL.

- [ ] **Step 3: Implement operational modules**

Add campaign targeting/preview/scheduling with send confirmation, entitlement history/resync, super-admin-only staff invitations/role changes/deactivation, filterable audit entries, and safe health cards for database, storage, scheduled content, background jobs, and redacted errors.

- [ ] **Step 4: Verify and commit**

Run: `pnpm --filter @sidequest/admin test -- operations.test.tsx`. Expected: PASS.

```bash
git add apps/admin/app apps/admin/features
git commit -m "feat: add admin operations modules"
```

### Task 10: Product Analytics and Exports

**Files:**
- Create: `apps/admin/app/analytics/page.tsx`
- Create: `apps/admin/features/analytics/analytics-dashboard.tsx`
- Create: `apps/admin/features/analytics/funnels.ts`
- Create: `apps/admin/features/analytics/export.ts`
- Test: `apps/admin/features/analytics/funnels.test.ts`
- Test: `apps/admin/tests/analytics.test.tsx`

**Interfaces:**
- Consumes: analytics events and role-aware repository aggregates.
- Produces: `calculateFunnel(events, steps)`, retention/content/subscription readouts, and `createAnalyticsCsv(dataset, role)` with privacy-aware columns.

- [ ] **Step 1: Write funnel and export tests**

```ts
expect(calculateFunnel(events, ["search", "detail", "save"]).steps[2].rate).toBe(0.4);
expect(createAnalyticsCsv(privateDataset, "analyst")).not.toContain("email");
```

- [ ] **Step 2: Run and verify failure**

Run: `pnpm --filter @sidequest/admin test -- funnels.test.ts analytics.test.tsx`  
Expected: FAIL.

- [ ] **Step 3: Implement analytics**

Build date/city/audience filters, acquisition, discovery, quest, retention, content-quality, moderation-time, and subscription panels. Add accessible chart summaries and role-aware CSV export.

- [ ] **Step 4: Verify and commit**

Run: `pnpm --filter @sidequest/admin test -- funnels.test.ts analytics.test.tsx`. Expected: PASS.

```bash
git add apps/admin/app/analytics apps/admin/features/analytics
git commit -m "feat: add admin analytics and exports"
```

### Task 11: End-to-End Verification, Accessibility, and Deployment Readiness

**Files:**
- Create: `apps/admin/playwright.config.ts`
- Create: `apps/admin/e2e/admin-core.spec.ts`
- Create: `apps/admin/e2e/permissions.spec.ts`
- Create: `apps/admin/.env.example`
- Create: `apps/admin/README.md`
- Create: `vercel.json`
- Modify: `figma-sidequest-state.json`

**Interfaces:**
- Consumes: complete application.
- Produces: reproducible local/deployment instructions and automated core-journey verification.

- [ ] **Step 1: Write end-to-end journeys**

```ts
test("content admin publishes a complete café", async ({ page }) => {
  await page.goto("/cafes/cafe-soft-hours");
  await page.getByRole("button", { name: "Publish café" }).click();
  await expect(page.getByText("Café published")).toBeVisible();
});
```

Add denied-action coverage for analyst mutations and a moderator report-resolution journey.

- [ ] **Step 2: Run the full verification suite**

Run: `pnpm test && pnpm typecheck && pnpm --filter @sidequest/admin build && pnpm --filter @sidequest/admin e2e`  
Expected: all commands exit 0.

- [ ] **Step 3: Run accessibility and responsive QA**

Verify keyboard navigation, focus order, labels, dialog focus trapping, reduced motion, 390px/768px/1440px layouts, loading/empty/error/denied states, and contrast. Fix every critical or serious finding and rerun the focused tests.

- [ ] **Step 4: Document setup and deployment**

Document demo mode, Supabase environment variables, migration/seed commands, role setup, test commands, Vercel configuration, and production security checklist. Update the state ledger with application paths and verification status.

- [ ] **Step 5: Final verification and commit**

Run: `pnpm test && pnpm typecheck && pnpm --filter @sidequest/admin build`. Expected: all commands exit 0.

```bash
git add apps/admin vercel.json figma-sidequest-state.json
git commit -m "chore: verify and document SIDEQUEST admin"
```

