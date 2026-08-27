# SIDEQUEST Consumer App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the runnable, mobile-first SIDEQUEST consumer café-discovery application from the approved Figma flow while preserving the existing admin platform.

**Architecture:** Keep one Next.js 16 application and split its App Router tree into `(admin)` and `(consumer)` route groups so both products share fonts, tokens, and deployment. Consumer behavior lives in focused feature modules with a localStorage-backed demo repository that can later be replaced by the existing Supabase foundation without changing screen components.

**Tech Stack:** Next.js 16.3.3 App Router, React 19, TypeScript 5.9, Lucide React, Vitest, Testing Library, Playwright.

**Spec:** `docs/SIDEQUEST_PRODUCT_PACKAGE.md`

## Global Constraints

- Preserve every existing admin URL and capability.
- Consumer application entry point is `/app`; the repository root redirects there.
- Mobile reference viewport is 390 × 844; desktop renders a centered phone-like content column with contextual side rails.
- Use Sora for display, Manrope for body, IBM Plex Mono for data labels.
- Use espresso, oat, crema, sage, and restrained lavender; glass effects only on the sticky navigation and transient overlays.
- Demo interactions persist locally and never collect precise location.
- Every action has accessible names, keyboard focus, and a minimum 44 px target.

---

### Task 1: Route separation and consumer domain

**Files:**
- Create: `apps/admin/app/(admin)/layout.tsx`
- Move: existing admin route directories into `apps/admin/app/(admin)/`
- Modify: `apps/admin/app/layout.tsx`
- Modify: `apps/admin/app/page.tsx`
- Create: `apps/admin/features/consumer/domain.ts`
- Test: `apps/admin/features/consumer/domain.test.ts`

**Interfaces:**
- Produces: `Cafe`, `Quest`, `Collection`, `ConsumerState`, `filterCafes(cafes, filters)`, and `matchCafe(cafe, preferences)`.

- [ ] **Step 1: Write failing domain tests** for budget/vibe filtering, deterministic match scores, and immutable collection updates.
- [ ] **Step 2: Run** `npm --prefix apps/admin test -- features/consumer/domain.test.ts` and confirm missing-module failure.
- [ ] **Step 3: Implement the minimal typed domain functions** and seed objects required by the tests.
- [ ] **Step 4: Run the focused test and confirm PASS.**
- [ ] **Step 5: Move admin routes behind `(admin)`**, add its shell layout, and make the root layout shell-neutral.
- [ ] **Step 6: Commit** with `feat: add consumer domain and route separation`.

### Task 2: Consumer state provider and application shell

**Files:**
- Create: `apps/admin/features/consumer/consumer-store.tsx`
- Create: `apps/admin/features/consumer/consumer-shell.tsx`
- Create: `apps/admin/features/consumer/consumer-nav.tsx`
- Create: `apps/admin/app/(consumer)/app/layout.tsx`
- Test: `apps/admin/features/consumer/consumer-store.test.tsx`

**Interfaces:**
- Consumes: domain types and seed data from Task 1.
- Produces: `useConsumer()`, `ConsumerProvider`, `ConsumerShell`, persistent saved cafés, active filters, quest progress, XP, and onboarding state.

- [ ] **Step 1: Write failing provider tests** proving save toggles, collection creation, filter updates, and quest completion.
- [ ] **Step 2: Run the focused test and confirm the provider is missing.**
- [ ] **Step 3: Implement the provider with guarded localStorage hydration** and pure reducer actions.
- [ ] **Step 4: Add the mobile shell and five-item bottom navigation.**
- [ ] **Step 5: Run focused tests and confirm PASS.**
- [ ] **Step 6: Commit** with `feat: add consumer state and navigation shell`.

### Task 3: Onboarding, home, and discovery

**Files:**
- Create: `apps/admin/app/(consumer)/app/page.tsx`
- Create: `apps/admin/app/(consumer)/app/onboarding/page.tsx`
- Create: `apps/admin/app/(consumer)/app/discover/page.tsx`
- Create: `apps/admin/features/consumer/home-screen.tsx`
- Create: `apps/admin/features/consumer/discovery-screen.tsx`
- Create: `apps/admin/features/consumer/cafe-card.tsx`
- Test: `apps/admin/features/consumer/discovery-screen.test.tsx`

**Interfaces:**
- Consumes: `useConsumer`, `filterCafes`, and seeded cafés.
- Produces: intent-first discovery, vibe/budget/use-case controls, list/map toggle, no-results recovery, and links to café details.

- [ ] **Step 1: Write failing screen tests** for visible match reasons, filter results, map/list switching, and filter reset.
- [ ] **Step 2: Run the focused test and confirm missing-screen failure.**
- [ ] **Step 3: Implement onboarding and home using real product copy from the spec.**
- [ ] **Step 4: Implement discovery list/map and recoverable empty state.**
- [ ] **Step 5: Run focused tests and confirm PASS.**
- [ ] **Step 6: Commit** with `feat: build consumer onboarding and discovery`.

### Task 4: Café details, saves, and reviews

**Files:**
- Create: `apps/admin/app/(consumer)/app/cafes/[id]/page.tsx`
- Create: `apps/admin/app/(consumer)/app/saved/page.tsx`
- Create: `apps/admin/app/(consumer)/app/review/[id]/page.tsx`
- Create: `apps/admin/features/consumer/cafe-detail-screen.tsx`
- Create: `apps/admin/features/consumer/saved-screen.tsx`
- Create: `apps/admin/features/consumer/review-screen.tsx`
- Test: `apps/admin/features/consumer/cafe-actions.test.tsx`

**Interfaces:**
- Consumes: café records and provider actions.
- Produces: café details, match explanation, verified hours, amenities, save/collection flow, structured vibe review, and review confirmation.

- [ ] **Step 1: Write failing interaction tests** for saving, collection display, required review signals, and successful submission.
- [ ] **Step 2: Verify RED.**
- [ ] **Step 3: Implement details, saved collections, and reviews.**
- [ ] **Step 4: Verify focused tests PASS.**
- [ ] **Step 5: Commit** with `feat: add cafe details saves and reviews`.

### Task 5: Quests, social, profile, settings, and subscription

**Files:**
- Create: `apps/admin/app/(consumer)/app/quests/page.tsx`
- Create: `apps/admin/app/(consumer)/app/quests/[id]/page.tsx`
- Create: `apps/admin/app/(consumer)/app/social/page.tsx`
- Create: `apps/admin/app/(consumer)/app/profile/page.tsx`
- Create: `apps/admin/app/(consumer)/app/settings/page.tsx`
- Create: `apps/admin/app/(consumer)/app/plus/page.tsx`
- Create: focused screen components under `apps/admin/features/consumer/`
- Test: `apps/admin/features/consumer/quest-flow.test.tsx`

**Interfaces:**
- Consumes: provider quest, XP, privacy, friend, and subscription state.
- Produces: quest browse/detail/active/completion, achievements, friend activity, privacy controls, and a non-transactional demo subscription choice.

- [ ] **Step 1: Write failing quest tests** for start, progress, completion, XP, and achievement updates.
- [ ] **Step 2: Verify RED.**
- [ ] **Step 3: Implement quest and achievement flow.**
- [ ] **Step 4: Implement social, profile, settings, and Plus screens with safe demo behavior.**
- [ ] **Step 5: Verify focused tests PASS.**
- [ ] **Step 6: Commit** with `feat: complete consumer quest and profile flows`.

### Task 6: Visual system, system states, and end-to-end verification

**Files:**
- Modify: `apps/admin/app/globals.css`
- Create: `apps/admin/app/(consumer)/app/loading.tsx`
- Create: `apps/admin/app/(consumer)/app/error.tsx`
- Modify: `apps/admin/e2e/admin-core.spec.ts`
- Create: `apps/admin/e2e/consumer-core.spec.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: all consumer routes.
- Produces: polished responsive presentation and executable acceptance coverage.

- [ ] **Step 1: Write failing Playwright tests** for onboarding, discovery, café save, quest completion, bottom navigation, and mobile overflow.
- [ ] **Step 2: Run consumer E2E and verify RED.**
- [ ] **Step 3: Implement the consumer CSS system, loading state, and recoverable error boundary.**
- [ ] **Step 4: Run unit tests, typecheck, production build, and all desktop/mobile E2E tests.**
- [ ] **Step 5: Perform browser visual QA at 390 × 844 and desktop width; correct any defects.**
- [ ] **Step 6: Update the README with `/app` as the consumer entry point.**
- [ ] **Step 7: Commit** with `feat: ship SIDEQUEST consumer app`.

